from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "image",
        "stock_quantity",
        "low_stock_threshold",
        "requires_prescription",
        "is_active",
    )
    list_filter = ("category", "requires_prescription", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
