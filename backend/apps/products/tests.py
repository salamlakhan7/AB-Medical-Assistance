import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.accounts.models import User

from .models import Category, Product


TEST_MEDIA_ROOT = tempfile.mkdtemp()


def tiny_gif(name="product.gif"):
    return SimpleUploadedFile(
        name,
        (
            b"GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00"
            b"\xff\xff\xff,\x00\x00\x00\x00\x01\x00\x01\x00"
            b"\x00\x02\x02D\x01\x00;"
        ),
        content_type="image/gif",
    )


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class ProductImageApiTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.owner = User.objects.create_user(
            username="image_owner",
            password="TestPass123!",
            role=User.Role.OWNER,
        )
        self.category = Category.objects.create(name="Image Category", slug="image-category")
        self.client = APIClient()
        self.client.force_authenticate(user=self.owner)

    def test_owner_can_upload_product_image(self):
        response = self.client.post(
            "/api/products/",
            {
                "name": "Image Product",
                "slug": "image-product",
                "category_id": self.category.id,
                "description": "Image product description",
                "price": "12.50",
                "stock_quantity": 10,
                "low_stock_threshold": 2,
                "requires_prescription": "false",
                "is_active": "true",
                "image": tiny_gif(),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("/media/products/", response.data["image_url"])
        self.assertTrue(Product.objects.get(slug="image-product").image.name)

    def test_owner_can_update_product_image(self):
        product = Product.objects.create(
            category=self.category,
            name="Existing Image Product",
            slug="existing-image-product",
            price="9.00",
            stock_quantity=5,
            low_stock_threshold=1,
        )

        response = self.client.patch(
            f"/api/products/{product.id}/",
            {"image": tiny_gif("updated-product.gif")},
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        product.refresh_from_db()
        self.assertIn("updated-product", product.image.name)
        self.assertIn("/media/products/", response.data["image_url"])

    def test_product_catalog_returns_image_url(self):
        product = Product.objects.create(
            category=self.category,
            name="Catalog Image Product",
            slug="catalog-image-product",
            price="9.00",
            stock_quantity=5,
            low_stock_threshold=1,
            image=tiny_gif("catalog-product.gif"),
        )

        response = self.client.get("/api/products/")

        self.assertEqual(response.status_code, 200)
        image_product = next(item for item in response.data if item["id"] == product.id)
        self.assertIn("/media/products/", image_product["image_url"])
