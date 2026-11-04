import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings

from .exceptions import MovieAPIError

BASE_URL = "https://api.themoviedb.org/3"
REQUEST_TIMEOUT = 10


def get_movies(path, **parameters):
    key = settings.TMDB_API_KEY.strip()
    if not key or key == "your_key_here":
        raise MovieAPIError(
            "Movie service is not configured.", code="tmdb_not_configured", status=503,
        )

    query = urlencode({"api_key": key, "language": "en-US", **parameters})
    request = Request(f"{BASE_URL}/{path}?{query}", headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            return json.load(response)
    except HTTPError as error:
        if error.code == 404:
            raise MovieAPIError(
                "Movie not found.", code="movie_not_found", status=404,
            ) from None
        if error.code == 429:
            raise MovieAPIError(
                "Movie service is busy. Try again later.", code="tmdb_rate_limited", status=503,
            ) from None
        raise MovieAPIError(
            "Movie service request failed.", code="tmdb_error", status=502,
        ) from None
    except TimeoutError:
        raise MovieAPIError(
            "Movie service timed out.", code="tmdb_timeout", status=504,
        ) from None
    except URLError as error:
        if isinstance(error.reason, TimeoutError):
            raise MovieAPIError(
                "Movie service timed out.", code="tmdb_timeout", status=504,
            ) from None
        raise MovieAPIError(
            "Movie service is unavailable.", code="tmdb_unavailable", status=502,
        ) from None
    except ValueError:
        raise MovieAPIError(
            "Invalid movie service response.", code="tmdb_invalid_response", status=502,
        ) from None
    except OSError:
        raise MovieAPIError(
            "Movie service is unavailable.", code="tmdb_unavailable", status=502,
        ) from None
