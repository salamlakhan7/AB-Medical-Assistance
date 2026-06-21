from rest_framework import serializers

from apps.products.serializers import ProductSerializer

from .models import RecommendationItem, RecommendationLog, SymptomSession


class RecommendationCreateSerializer(serializers.Serializer):
    symptoms = serializers.CharField(trim_whitespace=True, allow_blank=False)


class RecommendationItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = RecommendationItem
        fields = [
            "id",
            "product",
            "rank",
            "match_score",
            "reason",
            "product_name_snapshot",
            "safety_note_snapshot",
            "price_snapshot",
            "requires_prescription_snapshot",
            "subtotal",
            "created_at",
        ]

    def get_subtotal(self, obj):
        return obj.price_snapshot


class RecommendationLogSerializer(serializers.ModelSerializer):
    matched_category = serializers.CharField(source="matched_category.name", read_only=True)
    matched_category_slug = serializers.CharField(source="matched_category.slug", read_only=True)
    items = RecommendationItemSerializer(many=True, read_only=True)

    class Meta:
        model = RecommendationLog
        fields = [
            "id",
            "matched_category",
            "matched_category_slug",
            "recommendation_type",
            "engine_version",
            "summary",
            "safety_message",
            "items",
            "created_at",
        ]


class SymptomSessionListSerializer(serializers.ModelSerializer):
    latest_log = serializers.SerializerMethodField()

    class Meta:
        model = SymptomSession
        fields = [
            "id",
            "input_text",
            "age_group",
            "duration",
            "severity",
            "has_emergency_symptoms",
            "emergency_reason",
            "status",
            "latest_log",
            "created_at",
            "updated_at",
        ]

    def get_latest_log(self, obj):
        log = obj.recommendation_logs.first()
        return RecommendationLogSerializer(log).data if log else None


class SymptomSessionDetailSerializer(serializers.ModelSerializer):
    recommendation_logs = RecommendationLogSerializer(many=True, read_only=True)

    class Meta:
        model = SymptomSession
        fields = [
            "id",
            "input_text",
            "age_group",
            "duration",
            "severity",
            "has_emergency_symptoms",
            "emergency_reason",
            "status",
            "recommendation_logs",
            "created_at",
            "updated_at",
        ]
