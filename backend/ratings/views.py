from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from django.views.decorators.cache import never_cache

from core.api import api_endpoint, read_json

from . import services
from .validators import validate_movie_id, validate_page, validate_rating


@never_cache
@api_endpoint("GET", "HEAD", "POST")
def rating_collection(request):
    if request.method == "POST":
        data = read_json(request)
        score = validate_rating(data, creating=True)
        rating = services.create_rating(request, data["movie_id"], score)
        response = JsonResponse(services.serialize_rating(rating), status=201)
        response["Location"] = reverse("ratings:detail", kwargs={"movie_id": rating.movie_id})
        return response
    return JsonResponse(services.list_ratings(request, validate_page(request.GET)))


@never_cache
@api_endpoint("GET", "HEAD", "PATCH", "DELETE")
def rating_detail(request, movie_id):
    validate_movie_id(movie_id)
    if request.method == "PATCH":
        score = validate_rating(read_json(request))
        rating = services.update_rating(request, movie_id, score)
        return JsonResponse(services.serialize_rating(rating))
    if request.method == "DELETE":
        services.delete_rating(request, movie_id)
        return HttpResponse(status=204)
    return JsonResponse(services.serialize_rating(services.get_rating(request, movie_id)))
