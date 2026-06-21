from django.test import TestCase
from rest_framework.test import APIClient


class AuthenticationApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_customer_can_register_login_and_fetch_profile(self):
        register_response = self.client.post(
            "/api/auth/register/",
            {
                "username": "security_customer",
                "email": "security@example.com",
                "password": "TestPass123!",
                "role": "customer",
            },
            format="json",
        )

        self.assertEqual(register_response.status_code, 201)
        self.assertEqual(register_response.data["role"], "customer")

        login_response = self.client.post(
            "/api/auth/login/",
            {
                "username": "security_customer",
                "password": "TestPass123!",
            },
            format="json",
        )

        self.assertEqual(login_response.status_code, 200)
        self.assertIn("access", login_response.data)
        self.assertIn("refresh", login_response.data)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )
        me_response = self.client.get("/api/auth/me/")

        self.assertEqual(me_response.status_code, 200)
        self.assertEqual(me_response.data["username"], "security_customer")
