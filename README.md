# Cine Verse

## About the Project

**Cine Verse** provides an interactive movie search and rating interface powered by [The Movie Database (TMDB) public API](https://developer.themoviedb.org/docs/getting-started).

The main objectives of the application are:
- Search for movies via the TMDB API and display results with their poster and title.
- View detailed information about any selected movie, including synopsis, release date, and cast.
- Rate movies on a scale of **1 to 5**, with support for editing and deleting existing ratings.
- Browse a dedicated **Rated Movies** page listing all movies rated by the user along with their scores.

## Tech Stack

- **Frontend:** React, TypeScript, Next.js, Tailwind CSS
- **Backend:** Python, Django
- **Database:** PostgreSQL
- **External API:** The Movie Database (TMDB) API
- **Infrastructure:** Docker 

## Prerequisites

- Docker
- Ports `3000` and `8000` available on your machine.
- A TMDB API key 

## Environment Variables Configuration

Copy the example file from the repository root:

```bash
cp .env.example .env
```

Set `TMDB_API_KEY` to your own key. `POSTGRES_DB`, `POSTGRES_USER`, and
`POSTGRES_PASSWORD` configure both PostgreSQL and Django. Inside Docker,
`DB_HOST=db` and `DB_PORT=5432` address the database service.
`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, and `DJANGO_ALLOWED_HOSTS` configure Django.
The supplied defaults are for local development. Keep `.env` out of Git.

## Running Locally with Docker

From the repository root:

```bash
docker compose up --build
```

Compose waits for PostgreSQL, applies Django migrations, starts the backend,
and then starts the frontend once the API health check passes.

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/api/health/
- Proxied health: http://localhost:3000/api/health/

Stop services while preserving database data:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

After changing frontend dependencies, refresh the dependencies volume:

```bash
docker compose run --rm --no-deps frontend npm ci
docker compose up --build
```

## Implemented Features

- Docker Compose services for Django, React + TypeScript and PostgreSQL.
- Automatic migrations, persistent database storage and development reloads.
- Database-aware health endpoint and frontend connectivity status.
- Backend movie search by title through TMDB.
- Backend movie details with synopsis, release date, cast, runtime, genres, and TMDB average score.
- Movie details modal opened from search results, with responsive layout,
  complete cast, loading/error states, retry, and accessible keyboard navigation.
- Rating model and API for creating, reading, editing, deleting, and listing
  scores from 1 to 5, stored in PostgreSQL and isolated by user account.
- Interactive rating stars and save/delete actions in the details modal.
- Meus Filmes page at `/meus-filmes`, with scores, pagination, movie details,
  and deletion. Saved scores remain available after signing in on another device.
- Registration, login, logout, password validation, and Django session authentication.
- Genre/year filters on Meus Filmes
- Responsive search page  with movie posters, loading skeletons, empty/error states, retry, and incremental pagination.

## Unimplemented Features and Justifications

The required movie search, details, rating management, and Rated Movies flows
are implemented. The following features remain outside this delivery:

| Feature | Justification |
| --- | --- |
| Application-level caching (bonus) | Priority was given to the required flows, persistence, and account isolation|
| Infinite scroll | Incremental pagination with a **load more** button was chosen instead. |
| Password recovery and email verification | Require email delivery configuration and additional token/expiration flows. Registration, login, and logout are available. |
| Third-party login | Username/password authentication with Django sessions covers the selected authentication scope. OAuth provider registration and integration were not added. |

## API Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health/` | Checks database connectivity; returns HTTP 200 when ready or 503 when unavailable. |
| GET | `/api/movies/search/?query=batman&page=1` | Searches TMDB movie titles. |
| GET | `/api/movies/<movie_id>/` | Retrieves details and cast for a movie by its TMDB ID. |
| GET | `/api/csrf/` | Starts a browser session and returns a CSRF token for writes. |
| GET | `/api/auth/me/` | Returns the current user, or `{"user": null}` when anonymous. |
| POST | `/api/auth/register/` | Creates an account and signs in. |
| POST | `/api/auth/login/` | Signs in with username and password. |
| POST | `/api/auth/logout/` | Ends the current browser session. |
| GET | `/api/ratings/?page=1` | Lists this user's ratings, newest updates first (20 per page). |
| POST | `/api/ratings/` | Creates a rating from `{"movie_id": 27205, "score": 4}`. |
| GET | `/api/ratings/<movie_id>/` | Reads this user's rating for a movie. |
| PATCH | `/api/ratings/<movie_id>/` | Updates only the score: `{"score": 5}`. |
| DELETE | `/api/ratings/<movie_id>/` | Deletes this user's rating; returns 204 with no body. |
| GET | `/api/ratings/filter-options/` | Lists genres and years from this user's ratings. |

| Status | Meaning |
| --- | --- |
| 400 | Invalid query, page, or movie ID. |
| 401 | Login required, or invalid login credentials. |
| 403 | Missing/invalid CSRF token or untrusted origin on a write request. |
| 404 | Movie not found. |
| 405 | Unsupported method (movie endpoints accept GET and HEAD). |
| 409 | The user has already rated the movie, or a registration username conflict occurred. |
| 415 | A JSON write did not use `Content-Type: application/json`. |
| 502 | TMDB HTTP/network error or invalid response. |
| 503 | Missing API key or TMDB rate limit. |
| 504 | TMDB request timed out (10-second timeout). 

## Technical Decisions

- PostgreSQL stores application data in a named volume.
- Django 5.2 and Python 3.12 provide the initial backend foundation.
- Next.js, React, and TypeScript run on Node.js 22 for frontend development.
- Next.js rewrites forward `/api` to Django; the TMDB API key stays in the backend.

## Use of Artificial Intelligence

AI was used throughout development, including code generation and implementation
support

- **Antigravity** helped define the initial documentation structure.
- **Codex** assisted with repository setup, Docker Compose, Django configuration,
   API validation, and error handling.
- Codex also assisted with interface,
  components, hooks and page using the supplied mockup as a visual reference.
- Backend assistance included PostgreSQL models and migrations, genre/year
  filtering, Django session authentication
