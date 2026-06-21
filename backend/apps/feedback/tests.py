from django.test import TestCase


# Create feedback tests here in later phases.
from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.orders.models import Order, OrderItem
from apps.products.models import Category, Product

from .models import Feedback


class FeedbackApiTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="feedback_customer",
            password="TestPass123!",
            role=User.Role.CUSTOMER,
        )
        self.other_customer = User.objects.create_user(
            username="feedback_other",
            password="TestPass123!",
            role=User.Role.CUSTOMER,
        )
        self.owner = User.objects.create_user(
            username="feedback_owner",
            password="TestPass123!",
            role=User.Role.OWNER,
        )
        self.category = Category.objects.create(
            name="Feedback Category",
            slug="feedback-category",
            is_active=True,
        )
        self.product = Product.objects.create(
            category=self.category,
            name="Purchased Feedback Product",
            slug="purchased-feedback-product",
            price="12.00",
            is_active=True,
        )
        self.unpurchased_product = Product.objects.create(
            category=self.category,
            name="Unpurchased Feedback Product",
            slug="unpurchased-feedback-product",
            price="7.00",
            is_active=True,
        )
        self.order = Order.objects.create(
            user=self.customer,
            order_number="AB-FEEDBACK-TEST",
            subtotal="12.00",
            service_fee="2.50",
            total="14.50",
            customer_name="Feedback Customer",
            phone="+92 300 0000000",
            delivery_address="Feedback address",
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            product_name_snapshot=self.product.name,
            quantity=1,
            unit_price_snapshot=self.product.price,
        )
        self.client = APIClient()

    def test_anonymous_can_read_feedback(self):
        Feedback.objects.create(
            user=self.customer,
            product=self.product,
            order=self.order,
            rating=5,
            comment="Helpful",
        )

        response = self.client.get("/api/feedback/")
        product_response = self.client.get(f"/api/feedback/product/{self.product.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(product_response.status_code, 200)
        self.assertEqual(product_response.data["feedback_count"], 1)

    def test_customer_can_create_feedback_for_purchased_product(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            "/api/feedback/",
            {"product_id": self.product.id, "rating": 5, "comment": "Great product"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Feedback.objects.count(), 1)
        self.assertEqual(response.data["product"], self.product.id)

    def test_customer_cannot_create_feedback_for_unpurchased_product(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            "/api/feedback/",
            {"product_id": self.unpurchased_product.id, "rating": 4},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Feedback.objects.count(), 0)

    def test_owner_can_view_all_feedback_but_not_create(self):
        Feedback.objects.create(
            user=self.customer,
            product=self.product,
            order=self.order,
            rating=5,
        )
        self.client.force_authenticate(user=self.owner)

        get_response = self.client.get("/api/feedback/")
        post_response = self.client.post(
            "/api/feedback/",
            {"product_id": self.product.id, "rating": 5},
            format="json",
        )

        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(len(get_response.data), 1)
        self.assertEqual(post_response.status_code, 403)
