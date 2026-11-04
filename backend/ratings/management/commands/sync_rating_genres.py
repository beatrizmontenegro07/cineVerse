from django.core.management.base import BaseCommand

from movies.exceptions import MovieAPIError
from movies.services import get_movie_details
from ratings.models import Rating


class Command(BaseCommand):
    help = "Fill missing genre snapshots on legacy ratings without changing scores or timestamps."

    def handle(self, *args, **options):
        movie_ids = list(Rating.objects.filter(genres__isnull=True).order_by("movie_id").values_list("movie_id", flat=True).distinct())
        updated = 0
        failed = 0
        for movie_id in movie_ids:
            try:
                movie = get_movie_details(movie_id)
            except MovieAPIError as error:
                failed += 1
                self.stderr.write(f"Movie {movie_id}: {error.code}. Metadata left unchanged.")
                continue
            updated += Rating.objects.filter(movie_id=movie_id, genres__isnull=True).update(genres=movie["genres"])
        self.stdout.write(f"Updated {updated} rating(s); {failed} movie(s) unavailable. Scores and timestamps preserved.")
