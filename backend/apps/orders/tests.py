from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.carts.models import Cart, CartItem
from apps.products.models import Category, Product


class OrderInventoryApiTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="order_stock_customer",
            password="TestPass123!",
            role=User.Role.CUSTOMER,
        )
        self.category = Category.objects.create(name="Order Stock", slug="order-stock")
        self.product = Product.objects.create(
            category=self.category,
            name="Checkout Product",
            slug="checkout-product",
            price="8.00",
            stock_quantity=3,
            low_stock_threshold=1,
        )
        self.cart = Cart.objects.create(user=self.customer)
        self.client = APIClient()
        self.client.force_authenticate(user=self.customer)

    def test_checkout_reduces_stock_quantity(self):
        CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=2,
            unit_price_snapshot=self.product.price,
        )

        response = self.client.post(
            "/api/orders/",
            {
                "customer_name": "Stock Customer",
                "phone": "+92 300 0000000",
                "delivery_address": "Stock address",
                "payment_method": "cash",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 1)

    def test_checkout_blocks_quantity_above_stock(self):
        CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=4,
            unit_price_snapshot=self.product.price,
        )

        response = self.client.post(
            "/api/orders/",
            {
                "customer_name": "Stock Customer",
                "phone": "+92 300 0000000",
                "delivery_address": "Stock address",
                "payment_method": "cash",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 3)
