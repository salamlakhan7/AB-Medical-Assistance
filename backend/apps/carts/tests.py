from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.products.models import Category, Product


class CartInventoryApiTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="cart_stock_customer",
            password="TestPass123!",
            role=User.Role.CUSTOMER,
        )
        self.category = Category.objects.create(name="Cart Stock", slug="cart-stock")
        self.product = Product.objects.create(
            category=self.category,
            name="Limited Product",
            slug="limited-product",
            price="12.00",
            stock_quantity=2,
            low_stock_threshold=1,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.customer)

    def test_cannot_add_more_than_available_stock(self):
        response = self.client.post(
            "/api/cart/items/",
            {"product_id": self.product.id, "quantity": 3},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("quantity", response.data)

    def test_existing_cart_item_cannot_exceed_available_stock(self):
        first_response = self.client.post(
            "/api/cart/items/",
            {"product_id": self.product.id, "quantity": 2},
            format="json",
        )
        second_response = self.client.post(
            "/api/cart/items/",
            {"product_id": self.product.id, "quantity": 1},
            format="json",
        )

        self.assertEqual(first_response.status_code, 201)
        self.assertEqual(second_response.status_code, 400)
