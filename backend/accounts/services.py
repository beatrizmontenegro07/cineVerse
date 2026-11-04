from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import IntegrityError, transaction
from django.utils.translation import override

from core.api import APIError
from ratings.models import Rating

from .forms import RegistrationForm


def _credentials(data, *, registering=False):
    required = {"username", "password", "password_confirmation"} if registering else {"username", "password"}
    allowed = required | ({"email"} if registering else set())
    if not required <= data.keys() or not data.keys() <= allowed:
        raise APIError("Invalid authentication fields.", code="invalid_credentials_payload", status=400)
    limits = {"username": 150, "password": 128, "password_confirmation": 128, "email": 254}
    if any(not isinstance(value, str) or len(value) > limits[field] for field, value in data.items()):
        raise APIError("Invalid authentication fields.", code="invalid_credentials_payload", status=400)
    return {**data, "username": data["username"].strip()}


def _legacy_key(request):
    if not request.user.is_authenticated and request.session.get("ratings_enabled", False):
        return request.session.session_key
    return None


def _sign_in(request, user):
    old_key = _legacy_key(request)
    with transaction.atomic():
        # Serialize concurrent claims into the same account before merging.
        get_user_model().objects.select_for_update().get(pk=user.pk)
        if old_key:
            legacy = Rating.objects.filter(session_key=old_key, user__isnull=True)
            existing = Rating.objects.filter(user=user).values_list("movie_id", flat=True)
            legacy.exclude(movie_id__in=existing).update(user=user, session_key=None)
            legacy.delete()  # Conflicts keep the account's existing score.
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
    return serialize_user(user)


def register(request, data):
    data = _credentials(data, registering=True)
    with override("pt-br"):
        form = RegistrationForm({"username": data["username"], "email": data.get("email", ""), "password1": data["password"], "password2": data["password_confirmation"]})
        if not form.is_valid():
            names = {"password1": "password", "password2": "password_confirmation"}
            fields = {names.get(field, field): [str(message) for message in errors] for field, errors in form.errors.items()}
            raise APIError("Check the registration fields.", code="invalid_registration", status=400, fields=fields)
    try:
        with transaction.atomic():
            user = form.save()
    except IntegrityError:
        raise APIError("Username is already in use.", code="username_exists", status=409) from None
    return _sign_in(request, user)


def sign_in(request, data):
    data = _credentials(data)
    user = authenticate(request, username=data["username"], password=data["password"])
    if user is None:
        raise APIError("Invalid username or password.", code="invalid_credentials", status=401)
    return _sign_in(request, user)


def sign_out(request):
    logout(request)


def serialize_user(user):
    return {"id": user.pk, "username": user.username, "email": user.email}
