from functools import wraps

from django.http import JsonResponse

from . import services
from .exceptions import MovieAPIError
from .validators import validate_page, validate_query


def movie_endpoint(view):
    """Apply the same read-only JSON contract to movie endpoints."""
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if request.method not in {"GET", "HEAD"}:
            response = JsonResponse(
                {"error": {"code": "method_not_allowed", "message": "Use GET or HEAD."}},
                status=405,
            )
            response["Allow"] = "GET, HEAD"
            return response
        try:
            return JsonResponse(view(request, *args, **kwargs))
        except MovieAPIError as error:
            return JsonResponse(
                {"error": {"code": error.code, "message": str(error)}}, status=error.status,
            )
    return wrapped


@movie_endpoint
def movie_search(request):
    query = validate_query(request.GET)
    page = validate_page(request.GET)
    return services.search_movies(query, page)


@movie_endpoint
def movie_detail(request, movie_id):
    return services.get_movie_details(movie_id)
