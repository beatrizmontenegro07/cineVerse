from .exceptions import InvalidParameters

MAX_PAGE = 500
MAX_QUERY_LENGTH = 200


def validate_page(parameters):
    raw_page = parameters.get("page", "1")
    if not raw_page.isascii() or not raw_page.isdecimal() or len(raw_page) > 3:
        raise InvalidParameters(f"page must be an integer between 1 and {MAX_PAGE}.")
    page = int(raw_page)
    if not 1 <= page <= MAX_PAGE:
        raise InvalidParameters(f"page must be an integer between 1 and {MAX_PAGE}.")
    return page


def validate_query(parameters):
    query = parameters.get("query", "").strip()
    if not query or len(query) > MAX_QUERY_LENGTH:
        raise InvalidParameters(f"query must contain between 1 and {MAX_QUERY_LENGTH} characters.")
    return query
