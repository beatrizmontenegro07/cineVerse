from . import client
from .exceptions import MovieAPIError

POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"


def search_movies(query, page):
    return _movie_page(client.get_movies("search/movie", query=query, page=page, include_adult="false"))


def _movie_page(payload):
    """Normalize the upstream response to the fields used by our interface."""
    try:
        page = payload["page"]
        total_pages = payload["total_pages"]
        total_results = payload["total_results"]
        if type(page) is not int or page < 1:
            raise ValueError
        if any(type(value) is not int or value < 0 for value in (total_pages, total_results)):
            raise ValueError
        if not isinstance(payload["results"], list):
            raise ValueError
        return {
            "page": page,
            "total_pages": total_pages,
            "total_results": total_results,
            "results": [_movie_summary(movie) for movie in payload["results"]],
        }
    except (KeyError, TypeError, ValueError):
        raise MovieAPIError(
            "Invalid movie service response.", code="tmdb_invalid_response", status=502,
        ) from None


def _movie_summary(movie):
    movie_id, title = movie["id"], movie["title"]
    poster = movie.get("poster_path")
    if type(movie_id) is not int or movie_id < 1 or not isinstance(title, str):
        raise ValueError
    if poster is not None and (not isinstance(poster, str) or (poster and not poster.startswith("/"))):
        raise ValueError
    return {
        "id": movie_id,
        "title": title,
        "poster_url": f"{POSTER_BASE_URL}{poster}" if poster else None,
    }
