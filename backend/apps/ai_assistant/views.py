from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.response import Response

from .models import SymptomSession
from .permissions import IsCustomer
from .serializers import (
    RecommendationCreateSerializer,
    SymptomSessionDetailSerializer,
    SymptomSessionListSerializer,
)
from .services.recommendation_engine import create_recommendation


class RecommendationListCreateView(ListCreateAPIView):
    permission_classes = [IsCustomer]
    throttle_scope = "recommendations"

    def get_queryset(self):
        return (
            SymptomSession.objects.filter(user=self.request.user)
            .prefetch_related(
                "recommendation_logs__items__product__category",
                "recommendation_logs__matched_category",
            )
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return RecommendationCreateSerializer
        return SymptomSessionListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = create_recommendation(
            user=request.user,
            symptom_text=serializer.validated_data["symptoms"],
        )

        if result["status"] == "blocked_emergency":
            return Response(
                {
                    "status": "blocked_emergency",
                    "message": result["message"],
                    "keywords": result["emergency"]["matched_keywords"],
                    "session_id": result["session"].id,
                    "recommendation_log_id": result["recommendation_log"].id,
                },
                status=status.HTTP_201_CREATED,
            )

        if result["status"] == "no_match":
            return Response(
                {
                    "status": "no_match",
                    "message": result["message"],
                    "session_id": result["session"].id,
                    "recommendation_log_id": result["recommendation_log"].id,
                },
                status=status.HTTP_201_CREATED,
            )

        log = result["recommendation_log"]
        items = log.items.select_related("product__category").all()

        def get_product_image_url(product):
            if not product.image:
                return ""

            return request.build_absolute_uri(product.image.url)

        return Response(
            {
                "status": "completed",
                "matched_category": log.matched_category.name if log.matched_category else None,
                "matched_category_slug": log.matched_category.slug if log.matched_category else None,
                "message": result["message"],
                "safety_message": log.safety_message,
                "session_id": result["session"].id,
                "recommendation_log_id": log.id,
                "recommendations": [
                    {
                        "id": item.id,
                        "product_id": item.product.id,
                        "product_name": item.product_name_snapshot,
                        "category": item.product.category.name,
                        "category_slug": item.product.category.slug,
                        "rank": item.rank,
                        "match_score": item.match_score,
                        "reason": item.reason,
                        "price": item.price_snapshot,
                        "safety_note": item.safety_note_snapshot,
                        "requires_prescription": item.requires_prescription_snapshot,
                        "image_url": get_product_image_url(item.product),
                    }
                    for item in items
                ],
            },
            status=status.HTTP_201_CREATED,
        )


class RecommendationDetailView(RetrieveAPIView):
    serializer_class = SymptomSessionDetailSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return (
            SymptomSession.objects.filter(user=self.request.user)
            .prefetch_related(
                "recommendation_logs__items__product__category",
                "recommendation_logs__matched_category",
            )
        )
