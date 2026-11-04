from django.urls import include, path

from .views import health

urlpatterns = [
    path("api/health/", health, name="health"),
    path("api/movies/", include("movies.urls")),
]
