from django.urls import path

from . import views

app_name = "ratings"
urlpatterns = [
    path("", views.rating_collection, name="list"),
    path("<int:movie_id>/", views.rating_detail, name="detail"),
]
