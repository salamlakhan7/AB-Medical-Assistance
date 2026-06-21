from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.ai_assistant.models import RecommendationItem, RecommendationLog, SymptomSession
from apps.feedback.models import Feedback
from apps.orders.models import Order
from apps.products.models import Category, Product


class DashboardAnalyticsApiTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="analytics_owner",
            password="TestPass123!",
            role=User.Role.OWNER,
        )
        self.customer = User.objects.create_user(
            username="analytics_customer",
            password="TestPass123!",
            role=User.Role.CUSTOMER,
        )
        self.category = Category.objects.create(
            name="Analytics Category",
            slug="analytics-category",
            is_active=True,
        )
        Product.objects.create(
            category=self.category,
            name="Active Product",
            slug="active-product",
            price="10.00",
            stock_quantity=3,
            low_stock_threshold=5,
            is_active=True,
        )
        Product.objects.create(
            category=self.category,
            name="Inactive Product",
            slug="inactive-product",
            price="5.00",
            is_active=False,
        )
        Order.objects.create(
            user=self.customer,
            order_number="AB-ANALYTICS-PENDING",
            status=Order.Status.PENDING,
            subtotal="10.00",
            service_fee="2.50",
            total="12.50",
            customer_name="Analytics Customer",
            phone="+92 300 0000000",
            delivery_address="Analytics address",
        )
        Order.objects.create(
            user=self.customer,
            order_number="AB-ANALYTICS-PROCESSING",
            status=Order.Status.PROCESSING,
            subtotal="20.00",
            service_fee="2.50",
            total="22.50",
            customer_name="Analytics Customer",
            phone="+92 300 0000000",
            delivery_address="Analytics address",
        )
        session = SymptomSession.objects.create(
            user=self.customer,
            input_text="headache",
        )
        recommendation_log = RecommendationLog.objects.create(
            session=session,
            user=self.customer,
            matched_category=self.category,
            summary="Analytics recommendation",
        )
        RecommendationItem.objects.create(
            recommendation_log=recommendation_log,
            product=Product.objects.get(slug="active-product"),
            rank=1,
            match_score=20,
            reason="Matched keyword(s): headache",
            product_name_snapshot="Active Product",
            price_snapshot="10.00",
        )
        emergency_session = SymptomSession.objects.create(
            user=self.customer,
            input_text="chest pain",
            has_emergency_symptoms=True,
            emergency_reason="chest pain",
            status=SymptomSession.Status.BLOCKED_EMERGENCY,
        )
        RecommendationLog.objects.create(
            session=emergency_session,
            user=self.customer,
            summary="Emergency block",
        )
        Feedback.objects.create(user=self.customer, rating=5, comment="Great")
        self.client = APIClient()

    def test_anonymous_user_is_blocked(self):
        response = self.client.get("/api/dashboard/analytics/")

        self.assertEqual(response.status_code, 401)

    def test_customer_user_is_blocked(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.get("/api/dashboard/analytics/")

        self.assertEqual(response.status_code, 403)

    def test_owner_can_view_matching_counts(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.get("/api/dashboard/analytics/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_products"], 2)
        self.assertEqual(response.data["active_products"], 1)
        self.assertEqual(response.data["low_stock_products"], 1)
        self.assertEqual(response.data["total_orders"], 2)
        self.assertEqual(response.data["pending_orders"], 1)
        self.assertEqual(response.data["processing_orders"], 1)
        self.assertEqual(response.data["fulfilled_orders"], 0)
        self.assertEqual(response.data["cancelled_orders"], 0)
        self.assertEqual(response.data["total_customers"], 1)
        self.assertEqual(response.data["total_recommendations"], 2)
        self.assertEqual(response.data["total_feedback"], 1)

    def test_recommendation_analytics_blocks_customer(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.get("/api/dashboard/recommendations/")

        self.assertEqual(response.status_code, 403)

    def test_owner_can_view_recommendation_analytics(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.get("/api/dashboard/recommendations/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_recommendations"], 2)
        self.assertEqual(response.data["total_emergency_blocks"], 1)
        self.assertEqual(response.data["most_recommended_products"][0]["product_name_snapshot"], "Active Product")
        self.assertEqual(response.data["most_recommended_products"][0]["count"], 1)
        self.assertEqual(response.data["most_common_symptom_categories"][0]["matched_category__name"], "Analytics Category")
        self.assertEqual(response.data["most_common_symptom_categories"][0]["count"], 1)
        self.assertEqual(len(response.data["recent_recommendations"]), 2)
        self.assertEqual(len(response.data["recent_emergency_sessions"]), 1)
