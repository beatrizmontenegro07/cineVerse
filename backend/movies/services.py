from datetime import date

from . import client
from .exceptions import MovieAPIError


def search_movies(query, page):
    return _movie_page(client.get_movies("search/movie", query=query, page=page, include_adult="false"))


def get_movie_details(movie_id):
    payload = client.get_movies(f"movie/{movie_id}", append_to_response="credits")
    try:
        movie = _movie_summary(payload)
        if movie["id"] != movie_id:
            raise ValueError
        synopsis = _optional_text(payload.get("overview")) or ""
        release_date = _optional_text(payload.get("release_date"))
        if release_date:
            release_date = date.fromisoformat(release_date).isoformat()
        runtime = payload.get("runtime")
        if runtime is not None and (type(runtime) is not int or runtime < 0):
            raise ValueError
        vote_average = payload.get("vote_average")
        if vote_average is not None and (
            type(vote_average) not in (int, float)
            or not 0 <= vote_average <= 10
        ):
            raise ValueError
        genres, cast = payload["genres"], payload["credits"]["cast"]
        if not isinstance(genres, list) or not isinstance(cast, list):
            raise ValueError
        return {
            **movie,
            "synopsis": synopsis,
            "release_date": release_date,
            "runtime_minutes": runtime,
            "vote_average": vote_average,
            "genres": [_named_item(genre) for genre in genres],
            "cast": [_cast_member(actor) for actor in cast],
        }
    except (KeyError, TypeError, ValueError):
        raise MovieAPIError(
            "Invalid movie service response.", code="tmdb_invalid_response", status=502,
        ) from None


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
    if type(movie_id) is not int or movie_id < 1 or not isinstance(title, str):
        raise ValueError
    return {
        "id": movie_id,
        "title": title,
        "poster_url": _image_url(movie.get("poster_path")),
    }


def _image_url(path, *, size="w500"):
    if path is None or path == "":
        return None
    if not isinstance(path, str) or not path.startswith("/"):
        raise ValueError
    return f"https://image.tmdb.org/t/p/{size}{path}"


def _optional_text(value):
    if value is None or value == "":
        return None
    if not isinstance(value, str):
        raise ValueError
    return value


def _named_item(item):
    item_id, name = item["id"], item["name"]
    if type(item_id) is not int or item_id < 1 or not isinstance(name, str):
        raise ValueError
    return {"id": item_id, "name": name}


def _cast_member(actor):
    return {
        **_named_item(actor),
        "character": _optional_text(actor.get("character")) or "",
        "profile_url": _image_url(actor.get("profile_path"), size="w185"),
    }
