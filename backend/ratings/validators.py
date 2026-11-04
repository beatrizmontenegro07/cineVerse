from core.api import APIError


def _invalid(message):
    return APIError(message, code="invalid_parameters", status=400)


def validate_movie_id(value):
    if type(value) is not int or not 1 <= value <= 2_147_483_647:
        raise _invalid("movie_id must be an integer between 1 and 2147483647.")
    return value


def validate_rating(data, *, creating=False):
    expected_fields = {"movie_id", "score"} if creating else {"score"}
    if set(data) != expected_fields:
        raise _invalid(f"Provide only these fields: {', '.join(sorted(expected_fields))}.")
    score = data["score"]
    if type(score) is not int or not 1 <= score <= 5:
        raise _invalid("score must be an integer between 1 and 5.")
    if creating:
        validate_movie_id(data["movie_id"])
    return score


def validate_page(parameters):
    value = parameters.get("page", "1")
    if not value.isascii() or not value.isdecimal() or len(value) > 9 or int(value) < 1:
        raise _invalid("page must be a positive integer.")
    return int(value)


def validate_filters(parameters):
    filters = {}
    for field, minimum, maximum in (("genre", 1, 2_147_483_647), ("year", 1000, 9999)):
        value = parameters.get(field, "")
        if not value:
            continue
        if not value.isascii() or not value.isdecimal() or len(value) > 10:
            raise _invalid(f"{field} must be an integer between {minimum} and {maximum}.")
        number = int(value)
        if not minimum <= number <= maximum:
            raise _invalid(f"{field} must be an integer between {minimum} and {maximum}.")
        filters[field] = number
    return filters
