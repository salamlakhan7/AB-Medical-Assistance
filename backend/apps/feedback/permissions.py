from rest_framework.permissions import SAFE_METHODS, BasePermission


class FeedbackPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        return bool(user and user.is_authenticated and user.role == "customer")
