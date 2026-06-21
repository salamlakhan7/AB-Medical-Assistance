from decimal import Decimal

from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_id",
            "product_name_snapshot",
            "quantity",
            "unit_price_snapshot",
            "subtotal",
            "created_at",
        ]

    def get_subtotal(self, obj):
        return obj.unit_price_snapshot * obj.quantity


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_username = serializers.CharField(source="user.username", read_only=True)
    prescription_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "customer_username",
            "subtotal",
            "service_fee",
            "total",
            "customer_name",
            "phone",
            "delivery_address",
            "payment_method",
            "prescription_file",
            "prescription_file_url",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["prescription_file"]

    def get_prescription_file_url(self, obj):
        if not obj.prescription_file:
            return ""

        request = self.context.get("request")
        url = obj.prescription_file.url
        return request.build_absolute_uri(url) if request else url


class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=160)
    phone = serializers.CharField(max_length=40)
    delivery_address = serializers.CharField()
    payment_method = serializers.ChoiceField(
        choices=Order.PaymentMethod.choices,
        default=Order.PaymentMethod.CASH,
    )
    prescription_file = serializers.FileField(required=False, allow_empty_file=False)


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]


def calculate_cart_subtotal(cart):
    return sum(
        (item.unit_price_snapshot * item.quantity for item in cart.items.all()),
        Decimal("0.00"),
    )


def calculate_service_fee(cart):
    return Decimal("2.50") if cart.items.exists() else Decimal("0.00")
