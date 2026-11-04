from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_safe

from core.api import api_endpoint


@require_safe
def health(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except DatabaseError:
        return JsonResponse({"status": "unavailable", "database": "unavailable"}, status=503)
    return JsonResponse({"status": "ok", "database": "ok"})


@never_cache
@ensure_csrf_cookie
@api_endpoint("GET", "HEAD")
def csrf_token(request):
    if not request.session.get("initialized", False):
        request.session["initialized"] = True
    if not request.session.session_key:
        request.session.create()
    return JsonResponse({"csrf_token": get_token(request)})


def csrf_failure(request, reason=""):
    return JsonResponse(
        {"error": {"code": "csrf_failed", "message": "Missing or invalid CSRF token."}},
        status=403,
    )
