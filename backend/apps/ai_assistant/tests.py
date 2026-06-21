from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.products.models import Category, Product

from .models import RecommendationItem, RecommendationLog, SymptomSession


class RecommendationApiTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="recommendation_customer",
            password="TestPass123!",
            role=User.Role.CUSTOMER,
        )
        self.owner = User.objects.create_user(
            username="recommendation_owner",
            password="TestPass123!",
            role=User.Role.OWNER,
        )
        self.category = Category.objects.create(
            name="Analgesic",
            slug="analgesic",
            is_active=True,
        )
        self.product = Product.objects.create(
            category=self.category,
            name="Test Analgesic",
            slug="test-analgesic",
            description="Test product",
            price="6.50",
            safety_note="Use with care.",
            is_active=True,
        )
        self.client = APIClient()

    def authenticate_customer(self):
        self.client.force_authenticate(user=self.customer)

    def test_anonymous_user_is_blocked(self):
        response = self.client.get("/api/recommendations/")

        self.assertEqual(response.status_code, 401)

    def test_owner_user_is_blocked(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.post(
            "/api/recommendations/",
            {"symptoms": "headache and fever"},
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_customer_can_create_normal_recommendation(self):
        self.authenticate_customer()

        response = self.client.post(
            "/api/recommendations/",
            {"symptoms": "headache and fever"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "completed")
        self.assertEqual(response.data["matched_category"], "Analgesic")
        self.assertGreaterEqual(len(response.data["recommendations"]), 1)
        self.assertEqual(SymptomSession.objects.count(), 1)
        self.assertEqual(RecommendationLog.objects.count(), 1)
        self.assertEqual(RecommendationItem.objects.count(), 1)

    def test_customer_emergency_recommendation_returns_no_products(self):
        self.authenticate_customer()

        response = self.client.post(
            "/api/recommendations/",
            {"symptoms": "chest pain and difficulty breathing"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "blocked_emergency")
        self.assertIn("chest pain", response.data["keywords"])
        self.assertEqual(RecommendationItem.objects.count(), 0)

    def test_customer_no_match_recommendation(self):
        self.authenticate_customer()

        response = self.client.post(
            "/api/recommendations/",
            {"symptoms": "feeling strange today"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "no_match")
        self.assertEqual(RecommendationItem.objects.count(), 0)

    def test_customer_history_and_detail_are_scoped_to_user(self):
        self.authenticate_customer()
        create_response = self.client.post(
            "/api/recommendations/",
            {"symptoms": "headache"},
            format="json",
        )

        history_response = self.client.get("/api/recommendations/")
        detail_response = self.client.get(
            f"/api/recommendations/{create_response.data['session_id']}/"
        )

        self.assertEqual(history_response.status_code, 200)
        self.assertEqual(len(history_response.data), 1)
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.data["status"], "completed")
