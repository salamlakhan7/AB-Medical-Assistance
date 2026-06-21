from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .permissions import IsCustomer
from .serializers import CartItemCreateSerializer, CartItemUpdateSerializer, CartSerializer


def get_or_create_active_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user, status=Cart.Status.ACTIVE)
    return cart


class CartView(RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsCustomer]

    def get_object(self):
        return get_or_create_active_cart(self.request.user)


class CartItemCreateView(GenericAPIView):
    serializer_class = CartItemCreateSerializer
    permission_classes = [IsCustomer]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_active_cart(request.user)
        product = serializer.context["product"]
        quantity = serializer.validated_data["quantity"]
        existing_quantity = (
            CartItem.objects.filter(cart=cart, product=product)
            .values_list("quantity", flat=True)
            .first()
            or 0
        )

        if existing_quantity + quantity > product.stock_quantity:
            return Response(
                {
                    "quantity": [
                        f"Only {product.stock_quantity} unit(s) are available."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": quantity,
                "unit_price_snapshot": product.price,
            },
        )

        if not created:
            item.quantity += quantity
            item.unit_price_snapshot = product.price
            item.save(update_fields=["quantity", "unit_price_snapshot", "updated_at"])

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(GenericAPIView):
    serializer_class = CartItemUpdateSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return CartItem.objects.filter(
            cart__user=self.request.user,
            cart__status=Cart.Status.ACTIVE,
        )

    def patch(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(CartSerializer(item.cart).data)

    def delete(self, request, pk):
        item = self.get_object()
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data)


class CartClearView(APIView):
    permission_classes = [IsCustomer]

    def delete(self, request):
        cart = get_or_create_active_cart(request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)
