# cineVerse

## About the Project

**cineVerse** provides an interactive movie search and rating interface powered by [The Movie Database (TMDB) public API](https://developer.themoviedb.org/docs/getting-started).

The main objectives of the application are:
- Search for movies via the TMDB API and display results with their poster and title.
- View detailed information about any selected movie, including synopsis, release date, and cast.
- Rate movies on a scale of **1 to 5**, with support for editing and deleting existing ratings.
- Browse a dedicated **Rated Movies** page listing all movies rated by the user along with their scores.

## Tech Stack

- **Frontend:** React, TypeScript
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

## Unimplemented Features and Justifications

## API Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health/` | Checks database connectivity; returns HTTP 200 when ready or 503 when unavailable. |

## Tests

With the services running:

```bash
docker compose config --quiet
docker compose exec backend python manage.py check
docker compose exec backend python manage.py test config
docker compose exec frontend npm run build
```

The backend tests cover a successful database check and a database failure.

## Technical Decisions

- PostgreSQL stores application data in a named volume.
- Django 5.2 and Python 3.12 provide the initial backend foundation.
- Next.js, React, and TypeScript run on Node.js 22 for frontend development.
- Next.js rewrites forward `/api` to Django; the TMDB API key stays in the backend.

## Use of Artificial Intelligence

AI tools (Antigravity) were used to define initial documentation structure.
Codex assisted with the Docker and Django configuration

## License
