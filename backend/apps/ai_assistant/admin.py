from django.contrib import admin

from .models import RecommendationItem, RecommendationLog, SymptomSession


class RecommendationItemInline(admin.TabularInline):
    model = RecommendationItem
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(SymptomSession)
class SymptomSessionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "status",
        "severity",
        "has_emergency_symptoms",
        "created_at",
    ]
    list_filter = ["status", "severity", "age_group", "has_emergency_symptoms", "created_at"]
    search_fields = ["user__username", "input_text", "emergency_reason"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(RecommendationLog)
class RecommendationLogAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "matched_category",
        "recommendation_type",
        "engine_version",
        "created_at",
    ]
    list_filter = ["recommendation_type", "engine_version", "matched_category", "created_at"]
    search_fields = ["user__username", "summary", "safety_message"]
    readonly_fields = ["created_at"]
    inlines = [RecommendationItemInline]


@admin.register(RecommendationItem)
class RecommendationItemAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "recommendation_log",
        "product",
        "rank",
        "match_score",
        "price_snapshot",
        "created_at",
    ]
    list_filter = ["requires_prescription_snapshot", "created_at"]
    search_fields = ["product__name", "product_name_snapshot", "reason"]
    readonly_fields = ["created_at"]
