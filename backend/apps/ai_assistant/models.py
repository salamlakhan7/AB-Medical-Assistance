from django.conf import settings
from django.db import models


class SymptomSession(models.Model):
    class Status(models.TextChoices):
        COMPLETED = "completed", "Completed"
        BLOCKED_EMERGENCY = "blocked_emergency", "Blocked Emergency"
        NO_MATCH = "no_match", "No Match"

    class AgeGroup(models.TextChoices):
        CHILD = "child", "Child"
        ADULT = "adult", "Adult"
        SENIOR = "senior", "Senior"
        UNKNOWN = "unknown", "Unknown"

    class Severity(models.TextChoices):
        MILD = "mild", "Mild"
        MODERATE = "moderate", "Moderate"
        SEVERE = "severe", "Severe"
        UNKNOWN = "unknown", "Unknown"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="symptom_sessions",
    )
    input_text = models.TextField()
    age_group = models.CharField(
        max_length=20,
        choices=AgeGroup.choices,
        default=AgeGroup.UNKNOWN,
    )
    duration = models.CharField(max_length=120, blank=True)
    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
        default=Severity.UNKNOWN,
    )
    has_emergency_symptoms = models.BooleanField(default=False)
    emergency_reason = models.TextField(blank=True)
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.COMPLETED,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Symptom Session #{self.pk} - {self.user}"


class RecommendationLog(models.Model):
    class RecommendationType(models.TextChoices):
        RULE_BASED = "rule_based", "Rule Based"
        AI_ASSISTED = "ai_assisted", "AI Assisted"

    session = models.ForeignKey(
        SymptomSession,
        on_delete=models.CASCADE,
        related_name="recommendation_logs",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recommendation_logs",
    )
    matched_category = models.ForeignKey(
        "products.Category",
        on_delete=models.SET_NULL,
        related_name="recommendation_logs",
        null=True,
        blank=True,
    )
    recommendation_type = models.CharField(
        max_length=30,
        choices=RecommendationType.choices,
        default=RecommendationType.RULE_BASED,
    )
    engine_version = models.CharField(max_length=60, default="rule_based_v1")
    summary = models.TextField(blank=True)
    safety_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Recommendation Log #{self.pk} - {self.user}"


class RecommendationItem(models.Model):
    recommendation_log = models.ForeignKey(
        RecommendationLog,
        on_delete=models.CASCADE,
        related_name="items",
    )
    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT,
        related_name="recommendation_items",
    )
    rank = models.PositiveIntegerField(default=1)
    match_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    reason = models.TextField(blank=True)
    product_name_snapshot = models.CharField(max_length=180)
    safety_note_snapshot = models.TextField(blank=True)
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    requires_prescription_snapshot = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["rank", "created_at"]

    def __str__(self):
        return f"#{self.rank} {self.product_name_snapshot}"
