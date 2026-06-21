from django.urls import path

from .views import DashboardAnalyticsView, DashboardRecommendationAnalyticsView


urlpatterns = [
    path("dashboard/analytics/", DashboardAnalyticsView.as_view(), name="dashboard-analytics"),
    path(
        "dashboard/recommendations/",
        DashboardRecommendationAnalyticsView.as_view(),
        name="dashboard-recommendation-analytics",
    ),
]
