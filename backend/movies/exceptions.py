class MovieAPIError(Exception):
    """An error safe to return to an API consumer."""

    def __init__(self, message, *, code, status):
        super().__init__(message)
        self.code = code
        self.status = status


class InvalidParameters(MovieAPIError):
    def __init__(self, message):
        super().__init__(message, code="invalid_parameters", status=400)
