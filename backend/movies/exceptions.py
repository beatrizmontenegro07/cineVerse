from core.api import APIError


class MovieAPIError(APIError):
    """An error safe to return to an API consumer."""


class InvalidParameters(MovieAPIError):
    def __init__(self, message):
        super().__init__(message, code="invalid_parameters", status=400)
