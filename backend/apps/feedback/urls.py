from django.urls import path

from .views import FeedbackListCreateView, ProductFeedbackListView


urlpatterns = [
    path("feedback/", FeedbackListCreateView.as_view(), name="feedback-list-create"),
    path("feedback/product/<int:product_id>/", ProductFeedbackListView.as_view(), name="product-feedback-list"),
]
