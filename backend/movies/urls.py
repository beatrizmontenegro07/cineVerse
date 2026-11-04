from django.urls import path

from . import views

app_name = "movies"
urlpatterns = [
    path("search/", views.movie_search, name="search"),
    path("<int:movie_id>/", views.movie_detail, name="detail"),
]
