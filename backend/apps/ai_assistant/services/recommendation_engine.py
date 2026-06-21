from django.db import transaction

from apps.products.models import Category, Product

from ..models import RecommendationItem, RecommendationLog, SymptomSession
from .emergency_detector import detect_emergency
from .symptom_matcher import match_symptom_categories


SAFETY_MESSAGE = (
    "These suggestions are not a diagnosis. Follow product labels and consult a "
    "qualified healthcare professional for medical advice."
)
EMERGENCY_MESSAGE = (
    "Emergency symptoms were detected. Please seek urgent medical care or contact "
    "local emergency services immediately."
)


def create_recommendation(user, symptom_text, age_group=None, duration="", severity=None):
    emergency_result = detect_emergency(symptom_text)
    status = (
        SymptomSession.Status.BLOCKED_EMERGENCY
        if emergency_result["has_emergency"]
        else SymptomSession.Status.COMPLETED
    )

    with transaction.atomic():
        session = SymptomSession.objects.create(
            user=user,
            input_text=symptom_text,
            age_group=age_group or SymptomSession.AgeGroup.UNKNOWN,
            duration=duration,
            severity=severity or SymptomSession.Severity.UNKNOWN,
            has_emergency_symptoms=emergency_result["has_emergency"],
            emergency_reason=emergency_result["reason"],
            status=status,
        )

        if emergency_result["has_emergency"]:
            log = RecommendationLog.objects.create(
                session=session,
                user=user,
                summary=EMERGENCY_MESSAGE,
                safety_message=EMERGENCY_MESSAGE,
            )
            return {
                "status": "blocked_emergency",
                "session": session,
                "recommendation_log": log,
                "emergency": emergency_result,
                "recommended_products": [],
                "message": EMERGENCY_MESSAGE,
            }

        category_matches = match_symptom_categories(symptom_text)
        if not category_matches:
            session.status = SymptomSession.Status.NO_MATCH
            session.save(update_fields=["status", "updated_at"])
            log = RecommendationLog.objects.create(
                session=session,
                user=user,
                summary="No matching product category was found for the provided symptoms.",
                safety_message=SAFETY_MESSAGE,
            )
            return {
                "status": "no_match",
                "session": session,
                "recommendation_log": log,
                "emergency": emergency_result,
                "recommended_products": [],
                "message": "No matching product category was found.",
            }

        primary_match = category_matches[0]
        matched_category = Category.objects.filter(
            slug=primary_match["category_slug"],
            is_active=True,
        ).first()
        products = Product.objects.none()
        if matched_category:
            products = Product.objects.filter(
                category=matched_category,
                is_active=True,
            ).select_related("category").order_by("requires_prescription", "price", "name")[:5]

        if not products:
            session.status = SymptomSession.Status.NO_MATCH
            session.save(update_fields=["status", "updated_at"])
            log = RecommendationLog.objects.create(
                session=session,
                user=user,
                matched_category=matched_category,
                summary="No active products were found for the matched category.",
                safety_message=SAFETY_MESSAGE,
            )
            return {
                "status": "no_match",
                "session": session,
                "recommendation_log": log,
                "emergency": emergency_result,
                "category_matches": category_matches,
                "recommended_products": [],
                "message": "No active products were found for the matched category.",
            }

        log = RecommendationLog.objects.create(
            session=session,
            user=user,
            matched_category=matched_category,
            summary=f"Matched symptoms to {matched_category.name} products.",
            safety_message=SAFETY_MESSAGE,
        )
        recommendation_items = [
            RecommendationItem(
                recommendation_log=log,
                product=product,
                rank=index,
                match_score=primary_match["score"],
                reason=(
                    "Matched keyword(s): "
                    + ", ".join(primary_match["matched_keywords"])
                ),
                product_name_snapshot=product.name,
                safety_note_snapshot=product.safety_note,
                price_snapshot=product.price,
                requires_prescription_snapshot=product.requires_prescription,
            )
            for index, product in enumerate(products, start=1)
        ]
        RecommendationItem.objects.bulk_create(recommendation_items)

    return {
        "status": "completed",
        "session": session,
        "recommendation_log": log,
        "emergency": emergency_result,
        "category_matches": category_matches,
        "recommended_products": list(products),
        "message": f"Matched symptoms to {matched_category.name} products.",
    }
