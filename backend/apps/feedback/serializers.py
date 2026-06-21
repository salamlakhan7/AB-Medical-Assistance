from django.db.models import Avg
from rest_framework import serializers

from apps.orders.models import OrderItem
from apps.products.models import Product

from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = Feedback
        fields = [
            "id",
            "user",
            "username",
            "product",
            "product_name",
            "order",
            "order_number",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "product", "order"]


class FeedbackCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(required=False, allow_blank=True)

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist as exc:
            raise serializers.ValidationError("Product is not available.") from exc

        user = self.context["request"].user
        order_item = (
            OrderItem.objects.filter(order__user=user, product=product)
            .select_related("order")
            .order_by("-order__created_at")
            .first()
        )
        if not order_item:
            raise serializers.ValidationError(
                "Feedback can only be submitted for purchased products."
            )

        self.context["product"] = product
        self.context["order"] = order_item.order
        return value


def get_product_feedback_summary(product_id):
    queryset = Feedback.objects.filter(product_id=product_id)
    average_rating = queryset.aggregate(average_rating=Avg("rating"))["average_rating"]

    return {
        "average_rating": round(float(average_rating), 2) if average_rating else None,
        "feedback_count": queryset.count(),
    }
