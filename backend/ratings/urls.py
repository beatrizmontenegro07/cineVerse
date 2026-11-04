from django.urls import path

from . import views

app_name = "ratings"
urlpatterns = [
    path("filter-options/", views.rating_filter_options, name="filter-options"),
    path("", views.rating_collection, name="list"),
    path("<int:movie_id>/", views.rating_detail, name="detail"),
]
