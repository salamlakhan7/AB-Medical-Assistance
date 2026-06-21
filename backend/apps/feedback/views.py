from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response

from .models import Feedback
from .permissions import FeedbackPermission
from .serializers import (
    FeedbackCreateSerializer,
    FeedbackSerializer,
    get_product_feedback_summary,
)


class FeedbackListCreateView(ListCreateAPIView):
    queryset = Feedback.objects.select_related("user", "product", "order")
    permission_classes = [FeedbackPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return FeedbackCreateSerializer
        return FeedbackSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        feedback = Feedback.objects.create(
            user=request.user,
            product=serializer.context["product"],
            order=serializer.context["order"],
            rating=serializer.validated_data["rating"],
            comment=serializer.validated_data.get("comment", ""),
        )
        return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)


class ProductFeedbackListView(ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [FeedbackPermission]

    def get_queryset(self):
        return Feedback.objects.filter(product_id=self.kwargs["product_id"]).select_related(
            "user",
            "product",
            "order",
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(
            {
                **get_product_feedback_summary(kwargs["product_id"]),
                "results": self.get_serializer(queryset, many=True).data,
            }
        )
