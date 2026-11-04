from django.http import JsonResponse

from core.api import api_endpoint

from . import services
from .validators import validate_page, validate_query


@api_endpoint("GET", "HEAD")
def movie_search(request):
    query = validate_query(request.GET)
    page = validate_page(request.GET)
    return JsonResponse(services.search_movies(query, page))


@api_endpoint("GET", "HEAD")
def movie_detail(request, movie_id):
    return JsonResponse(services.get_movie_details(movie_id))
