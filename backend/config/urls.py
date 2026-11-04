from django.urls import include, path

from .views import csrf_token, health

urlpatterns = [
    path("api/health/", health, name="health"),
    path("api/movies/", include("movies.urls")),
    path("api/ratings/", include("ratings.urls")),
    path("api/csrf/", csrf_token, name="csrf"),
    path("api/auth/", include("accounts.urls")),
]
