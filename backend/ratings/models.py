from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Rating(models.Model):
    session_key = models.CharField(max_length=40, editable=False)
    movie_id = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(2_147_483_647)])
    title = models.TextField()
    poster_url = models.URLField(max_length=1000, null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    score = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "-pk"]
        constraints = [
            models.UniqueConstraint(fields=["session_key", "movie_id"], name="unique_session_movie_rating"),
            models.CheckConstraint(condition=models.Q(score__gte=1, score__lte=5), name="rating_score_between_1_and_5"),
            models.CheckConstraint(condition=models.Q(movie_id__gte=1, movie_id__lte=2_147_483_647), name="rating_valid_movie_id"),
        ]

    def __str__(self):
        return f"{self.title}: {self.score}/5"
