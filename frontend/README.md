# Frontend

Next.js App Router with React, TypeScript, and Tailwind CSS v4 through PostCSS.
Run the application from the repository root with `docker compose up --build`.
If the dependencies volume already exists, refresh it first with
`docker compose run --rm --no-deps frontend npm ci`.

## Structure

- `src/app`: page composition, metadata, global styles, and Tailwind theme.
- `src/components`: shared navigation, SVG icons, accessible dialog, and image fallback.
- `src/features/movies/api.ts`: typed search request, response validation, and user-facing errors.
- `src/features/movies/hooks`: cancellation, pagination, deduplication, and search state.
- `src/features/movies/components`: search form, banner, grid, cards, skeletons, and feedback.
- `src/features/movies/types.ts`: the Django API response contract.
- `src/features/ratings`: rating API, session/CSRF handling, typed models,
  mutation/list hooks, interactive stars, and rated movie rows.
- `src/lib/api.ts`: shared JSON transport, error mapping, timeouts, and cookies.
- `src/components/layout/app-shell.tsx`: shared page layout and navigation.

## Search behavior

Submit a title with Enter or the search button, or choose a suggested title.
Clear the field to return to the initial state. “Mais resultados” appends the
next page, up to the API limit of 500 pages. Failed page requests preserve the
loaded results and can be retried. Starting another search cancels the previous
request. The browser calls `/api/movies/search/` through Next.js rewrites.

Cards display only title and poster because the current API does not return
release years. Selecting a card opens the movie details modal.

## Movie details

The modal requests `/api/movies/<id>/` through the existing Next.js rewrite.
It displays the poster, title, release year/date, synopsis, runtime, TMDB score,
genres, and cast portraits. Four cast members are shown initially; the full cast
can be expanded. Missing fields and unavailable images have readable fallbacks.

The shared native dialog locks background scrolling, keeps keyboard focus
inside, and restores focus to the selected card on close. Close it with Escape,
the close button, or a click on the backdrop. Closing also cancels the request.
Errors can be retried without losing the current search results.

## Ratings and Meus Filmes

Choose 1–5 stars using the mouse or radio-group arrow keys, then select
“Salvar avaliação”. Choosing stars alone does not write to the database.
The saved score is loaded whenever the modal opens. Saving creates or updates
the session's rating in PostgreSQL; the trash button deletes it. Operations
show progress and errors, prevent duplicate submissions, and retain the selected
score if a write fails.

`/meus-filmes` lists saved posters, titles, release years, and scores, with
incremental pagination. Open a movie's details to edit its rating, or delete it
directly in the list. Mutation events refresh the current list; refocusing the
window also refreshes it. Reloading the page reads the saved server state.

Writes initialize the Django session through `/api/csrf/` and send the token
with same-origin cookies. Concurrent bootstrap requests are shared. No rating
is persisted in localStorage. Access to the collection depends on retaining the
browser session cookie. Profile/login features are still pending.

## Validation

```bash
docker compose exec frontend npm run typecheck
docker compose run --rm --no-deps -v /app/.next frontend npm run build
```

The temporary build volume keeps production artifacts separate from the running
development server. Browser checks may use mocked API responses without adding
fixtures to production code.

## Generated banner

Asset: `public/images/cinema-hero.webp`. Generated using the built-in image
generation tool, then optimized to WebP for local serving. The film reel brand
mark and interface icons are SVG components.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: wide cinematic background for a movie search website hero. Primary request: photorealistic vintage 35mm cinema film projector on the far right side of a widescreen dark scene. Two metal film reels with circular holes, rich worn black metal detail, lens casting a gentle warm white beam diagonally left through subtle blue-violet atmospheric smoke. Composition: 1536x1024 landscape image, projector occupies the RIGHT 35 percent, LEFT 65 percent is very dark almost black negative space for white website heading. Moody premium cinema photography, black and charcoal with restrained deep purple blue haze, small warm bronze highlights. Realistic photographic texture, dramatic low-key lighting. No text, no letters, no UI, no logos, no watermark. This is a background image only, not a website screenshot.
