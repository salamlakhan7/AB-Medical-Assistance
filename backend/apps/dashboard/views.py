from django.db.models import Count, F
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.ai_assistant.models import RecommendationItem, RecommendationLog, SymptomSession
from apps.feedback.models import Feedback
from apps.orders.models import Order
from apps.products.models import Product

from .permissions import IsOwnerOrAdmin


class DashboardAnalyticsView(APIView):
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request):
        return Response(
            {
                "total_products": Product.objects.count(),
                "active_products": Product.objects.filter(is_active=True).count(),
                "low_stock_products": Product.objects.filter(
                    is_active=True,
                    stock_quantity__lte=F("low_stock_threshold"),
                ).count(),
                "total_orders": Order.objects.count(),
                "pending_orders": Order.objects.filter(status=Order.Status.PENDING).count(),
                "processing_orders": Order.objects.filter(status=Order.Status.PROCESSING).count(),
                "fulfilled_orders": Order.objects.filter(status=Order.Status.FULFILLED).count(),
                "cancelled_orders": Order.objects.filter(status=Order.Status.CANCELLED).count(),
                "total_customers": User.objects.filter(role=User.Role.CUSTOMER).count(),
                "total_recommendations": RecommendationLog.objects.count(),
                "total_feedback": Feedback.objects.count(),
            }
        )


class DashboardRecommendationAnalyticsView(APIView):
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request):
        recent_recommendations = (
            RecommendationLog.objects.select_related("user", "matched_category", "session")
            .prefetch_related("items")
            .order_by("-created_at")[:10]
        )
        recent_emergency_sessions = (
            SymptomSession.objects.filter(status=SymptomSession.Status.BLOCKED_EMERGENCY)
            .select_related("user")
            .order_by("-created_at")[:10]
        )

        return Response(
            {
                "total_recommendations": RecommendationLog.objects.count(),
                "total_emergency_blocks": SymptomSession.objects.filter(
                    status=SymptomSession.Status.BLOCKED_EMERGENCY
                ).count(),
                "most_recommended_products": list(
                    RecommendationItem.objects.values("product_id", "product_name_snapshot")
                    .annotate(count=Count("id"))
                    .order_by("-count", "product_name_snapshot")[:5]
                ),
                "most_common_symptom_categories": list(
                    RecommendationLog.objects.filter(matched_category__isnull=False)
                    .values("matched_category_id", "matched_category__name", "matched_category__slug")
                    .annotate(count=Count("id"))
                    .order_by("-count", "matched_category__name")[:5]
                ),
                "recent_recommendations": [
                    {
                        "id": log.id,
                        "session_id": log.session_id,
                        "username": log.user.username,
                        "symptoms": log.session.input_text,
                        "status": log.session.status,
                        "matched_category": log.matched_category.name if log.matched_category else None,
                        "recommended_products": [
                            item.product_name_snapshot for item in list(log.items.all())[:3]
                        ],
                        "created_at": log.created_at.isoformat(),
                    }
                    for log in recent_recommendations
                ],
                "recent_emergency_sessions": [
                    {
                        "id": session.id,
                        "username": session.user.username,
                        "symptoms": session.input_text,
                        "emergency_reason": session.emergency_reason,
                        "created_at": session.created_at.isoformat(),
                    }
                    for session in recent_emergency_sessions
                ],
            }
        )
