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

## Repository Structure

```text
backend/   # Python (Django)
frontend/  # React + TypeScript interface
  src/app/ # Next.js App Router pages and root layout
```

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
- Responsive search page  with movie posters, loading skeletons, empty/error states, retry, and incremental pagination.

## Unimplemented Features and Justifications

Movie details and ratings are pending subsequent phases.

## API Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health/` | Checks database connectivity; returns HTTP 200 when ready or 503 when unavailable. |
| GET | `/api/movies/search/?query=batman&page=1` | Searches TMDB movie titles. |

The search endpoint accepts `page` from 1 to 500 (default: 1).
Search uses [movie search endpoint](https://developer.themoviedb.org/reference/search-movie).
Configure a valid TMDB v3 API key in `.env` and recreate the backend after changing it:

```bash
docker compose up -d backend
curl 'http://localhost:8000/api/movies/search/?query=batman&page=1'
```

Example response :

```json
{
  "page": 1,
  "total_pages": 1,
  "total_results": 1,
  "results": [
    {"id": 272, "title": "Batman Begins", "poster_url": null}
  ]
}
```


| Status | Meaning |
| --- | --- |
| 400 | Invalid query or page. |
| 405 | Unsupported method (movie endpoints accept GET and HEAD). |
| 502 | TMDB HTTP/network error or invalid response. |
| 503 | Missing API key or TMDB rate limit. |
| 504 | TMDB request timed out (10-second timeout). |

## Technical Decisions

- PostgreSQL stores application data in a named volume.
- Django 5.2 and Python 3.12 provide the initial backend foundation.
- Next.js, React, and TypeScript run on Node.js 22 for frontend development.
- Next.js rewrites forward `/api` to Django; the TMDB API key stays in the backend.

## Use of Artificial Intelligence

AI tools (Antigravity) were used to define initial documentation structure.
Codex assisted with the Docker and Django configuration
and the frontend search page.
