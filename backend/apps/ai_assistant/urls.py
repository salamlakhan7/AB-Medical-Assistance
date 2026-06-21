from django.urls import path

from .views import RecommendationDetailView, RecommendationListCreateView


urlpatterns = [
    path("recommendations/", RecommendationListCreateView.as_view(), name="recommendation-list-create"),
    path("recommendations/<int:pk>/", RecommendationDetailView.as_view(), name="recommendation-detail"),
]
