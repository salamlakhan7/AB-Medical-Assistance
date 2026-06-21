from decimal import Decimal

from rest_framework import serializers

from apps.products.models import Product

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_category = serializers.CharField(source="product.category.name", read_only=True)
    product_status = serializers.SerializerMethodField()
    available_stock = serializers.IntegerField(source="product.stock_quantity", read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "product_category",
            "product_status",
            "available_stock",
            "quantity",
            "unit_price_snapshot",
            "subtotal",
            "created_at",
            "updated_at",
        ]

    def get_product_status(self, obj):
        if not obj.product.is_active or obj.product.stock_quantity <= 0:
            return "Out of Stock"
        if obj.product.is_low_stock:
            return "Low Stock"
        return "In Stock"

    def get_subtotal(self, obj):
        return obj.unit_price_snapshot * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    service_fee = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "status",
            "items",
            "subtotal",
            "service_fee",
            "total",
            "created_at",
            "updated_at",
        ]

    def get_subtotal(self, obj):
        return sum((item.unit_price_snapshot * item.quantity for item in obj.items.all()), Decimal("0.00"))

    def get_service_fee(self, obj):
        return Decimal("2.50") if obj.items.exists() else Decimal("0.00")

    def get_total(self, obj):
        return self.get_subtotal(obj) + self.get_service_fee(obj)


class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist as exc:
            raise serializers.ValidationError("Product is not available.") from exc

        if product.stock_quantity <= 0:
            raise serializers.ValidationError("Product is out of stock.")

        self.context["product"] = product
        return value

    def validate(self, attrs):
        product = self.context.get("product")
        quantity = attrs.get("quantity", 1)

        if product and quantity > product.stock_quantity:
            raise serializers.ValidationError(
                {"quantity": f"Only {product.stock_quantity} unit(s) are available."}
            )

        return attrs


class CartItemUpdateSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = CartItem
        fields = ["quantity"]

    def validate_quantity(self, value):
        if self.instance and value > self.instance.product.stock_quantity:
            raise serializers.ValidationError(
                f"Only {self.instance.product.stock_quantity} unit(s) are available."
            )
        return value
