import json
from functools import wraps

from django.http import JsonResponse


class APIError(Exception):
    """An error safe to expose to API consumers."""

    def __init__(self, message, *, code, status, fields=None):
        super().__init__(message)
        self.code = code
        self.status = status
        self.fields = fields


def api_endpoint(*methods):
    def decorate(view):
        @wraps(view)
        def wrapped(request, *args, **kwargs):
            if request.method not in methods:
                response = JsonResponse(
                    {"error": {"code": "method_not_allowed", "message": "Method not allowed."}},
                    status=405,
                )
                response["Allow"] = ", ".join(methods)
                return response
            try:
                return view(request, *args, **kwargs)
            except APIError as error:
                payload = {"code": error.code, "message": str(error)}
                if error.fields:
                    payload["fields"] = error.fields
                return JsonResponse(
                    {"error": payload}, status=error.status,
                )
        return wrapped
    return decorate


def read_json(request):
    if request.content_type != "application/json":
        raise APIError("Use Content-Type: application/json.", code="unsupported_media_type", status=415)
    try:
        data = json.loads(request.body)
    except ValueError:
        raise APIError("Request body must be valid JSON.", code="invalid_json", status=400) from None
    if not isinstance(data, dict):
        raise APIError("Request body must be a JSON object.", code="invalid_json", status=400)
    return data


def authenticated(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise APIError("Authentication required.", code="authentication_required", status=401)
        return view(request, *args, **kwargs)
    return wrapped
