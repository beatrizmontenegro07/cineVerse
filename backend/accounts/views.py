from django.http import JsonResponse
from django.views.decorators.cache import never_cache

from core.api import api_endpoint, read_json

from . import services


@never_cache
@api_endpoint("POST")
def register(request):
    return JsonResponse({"user": services.register(request, read_json(request))}, status=201)


@never_cache
@api_endpoint("POST")
def sign_in(request):
    return JsonResponse({"user": services.sign_in(request, read_json(request))})


@never_cache
@api_endpoint("POST")
def sign_out(request):
    services.sign_out(request)
    return JsonResponse({"user": None})


@never_cache
@api_endpoint("GET", "HEAD")
def current_user(request):
    return JsonResponse({"user": services.serialize_user(request.user) if request.user.is_authenticated else None})
