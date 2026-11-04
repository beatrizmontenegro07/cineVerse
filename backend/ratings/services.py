from django.core.paginator import EmptyPage, Paginator
from django.db import IntegrityError, transaction

from core.api import APIError
from movies.services import get_movie_details

from .models import Rating

PAGE_SIZE = 20


def _session_ratings(request):
    if not request.session.get("ratings_enabled", False):
        return Rating.objects.none()
    key = request.session.session_key
    return Rating.objects.filter(session_key=key) if key else Rating.objects.none()


def get_rating(request, movie_id):
    try:
        return _session_ratings(request).get(movie_id=movie_id)
    except Rating.DoesNotExist:
        raise APIError("Rating not found.", code="rating_not_found", status=404) from None


def list_ratings(request, page):
    paginator = Paginator(_session_ratings(request), PAGE_SIZE)
    try:
        ratings = paginator.page(page)
    except EmptyPage:
        raise APIError("Page not found.", code="page_not_found", status=404) from None
    return {
        "page": ratings.number,
        "total_pages": paginator.num_pages,
        "total_results": paginator.count,
        "results": [serialize_rating(rating) for rating in ratings],
    }


def _duplicate_rating():
    return APIError("Movie is already rated.", code="rating_exists", status=409)


def create_rating(request, movie_id, score):
    if _session_ratings(request).filter(movie_id=movie_id).exists():
        raise _duplicate_rating()
    movie = get_movie_details(movie_id)
    request.session["ratings_enabled"] = True
    if not request.session.session_key:
        request.session.create()
    try:
        with transaction.atomic():
            return Rating.objects.create(
                session_key=request.session.session_key,
                movie_id=movie_id,
                title=movie["title"],
                poster_url=movie["poster_url"],
                release_date=movie["release_date"],
                score=score,
            )
    except IntegrityError:
        if _session_ratings(request).filter(movie_id=movie_id).exists():
            raise _duplicate_rating() from None
        raise


def update_rating(request, movie_id, score):
    rating = get_rating(request, movie_id)
    rating.score = score
    rating.save(update_fields=["score", "updated_at"])
    return rating


def delete_rating(request, movie_id):
    get_rating(request, movie_id).delete()


def serialize_rating(rating):
    return {
        "movie_id": rating.movie_id,
        "title": rating.title,
        "poster_url": rating.poster_url,
        "release_date": str(rating.release_date) if rating.release_date else None,
        "score": rating.score,
        "created_at": rating.created_at.isoformat(),
        "updated_at": rating.updated_at.isoformat(),
    }
