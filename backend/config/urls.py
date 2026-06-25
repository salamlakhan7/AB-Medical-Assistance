from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.views.static import serve
from django.urls import re_path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/", include("apps.ai_assistant.urls")),
    path("api/", include("apps.carts.urls")),
    path("api/", include("apps.dashboard.urls")),
    path("api/", include("apps.feedback.urls")),
    path("api/", include("apps.orders.urls")),
    path("api/", include("apps.products.urls")),
]

#if settings.DEBUG:
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#urlpatterns += static( settings.MEDIA_URL, document_root=settings.MEDIA_ROOT,)
urlpatterns += [
    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {"document_root": settings.MEDIA_ROOT},
    ),
]
    
