from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from apps.carts.models import Cart
from apps.products.models import Product

from .models import Order, OrderItem
from .permissions import IsCustomerOwnerOrAdmin
from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
    calculate_cart_subtotal,
    calculate_service_fee,
)


def user_can_view_all_orders(user):
    return user.role in ["owner", "admin"] or user.is_superuser


def user_can_manage_orders(user):
    return user and user.is_authenticated and (
        user.role in ["owner", "admin"] or user.is_superuser
    )


def generate_order_number():
    timestamp = timezone.now().strftime("%Y%m%d%H%M%S%f")
    return f"AB-{timestamp}"


class OrderListCreateView(ListCreateAPIView):
    permission_classes = [IsCustomerOwnerOrAdmin]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.prefetch_related("items__product").select_related("user")
        if user_can_view_all_orders(self.request.user):
            return queryset
        return queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role != "customer":
            return Response(
                {"detail": "Only customer accounts can create orders."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            cart = (
                Cart.objects.select_for_update()
                .filter(user=request.user, status=Cart.Status.ACTIVE)
                .first()
            )
            if not cart or not cart.items.exists():
                return Response(
                    {"detail": "Your cart is empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart_items = list(cart.items.select_related("product"))
            locked_products = Product.objects.select_for_update().filter(
                id__in=[item.product_id for item in cart_items]
            )
            product_by_id = {product.id: product for product in locked_products}
            stock_errors = []

            for item in cart_items:
                product = product_by_id.get(item.product_id)
                if not product or not product.is_active:
                    stock_errors.append(f"{item.product.name} is no longer available.")
                elif product.stock_quantity <= 0:
                    stock_errors.append(f"{product.name} is out of stock.")
                elif item.quantity > product.stock_quantity:
                    stock_errors.append(
                        f"{product.name} has only {product.stock_quantity} unit(s) available."
                    )

            if stock_errors:
                return Response(
                    {"detail": " ".join(stock_errors)},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            subtotal = calculate_cart_subtotal(cart)
            service_fee = calculate_service_fee(cart)
            order = Order.objects.create(
                user=request.user,
                order_number=generate_order_number(),
                subtotal=subtotal,
                service_fee=service_fee,
                total=subtotal + service_fee,
                **serializer.validated_data,
            )

            order_items = [
                OrderItem(
                    order=order,
                    product=item.product,
                    product_name_snapshot=item.product.name,
                    quantity=item.quantity,
                    unit_price_snapshot=item.unit_price_snapshot,
                )
                for item in cart_items
            ]
            OrderItem.objects.bulk_create(order_items)

            for item in cart_items:
                product = product_by_id[item.product_id]
                product.stock_quantity -= item.quantity
                product.save(update_fields=["stock_quantity", "updated_at"])

            cart.status = Cart.Status.CHECKED_OUT
            cart.save(update_fields=["status", "updated_at"])
            cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsCustomerOwnerOrAdmin]

    def get_queryset(self):
        queryset = Order.objects.prefetch_related("items__product").select_related("user")
        if user_can_view_all_orders(self.request.user):
            return queryset
        return queryset.filter(user=self.request.user)


class OrderStatusUpdateView(UpdateAPIView):
    serializer_class = OrderStatusUpdateSerializer
    http_method_names = ["patch"]

    def get_queryset(self):
        return Order.objects.prefetch_related("items__product").select_related("user")

    def patch(self, request, *args, **kwargs):
        if not user_can_manage_orders(request.user):
            return Response(
                {"detail": "Only owner or admin accounts can update order status."},
                status=status.HTTP_403_FORBIDDEN,
            )

        response = super().patch(request, *args, **kwargs)
        order = self.get_object()
        return Response(OrderSerializer(order).data, status=response.status_code)
