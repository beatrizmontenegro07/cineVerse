import { Icon } from '../../../components/ui/icon';
import { MediaImage } from '../../../components/ui/media-image';
import { formatReleaseDate, formatRuntime } from '../formatters';
import type { MovieDetails } from '../types';
import { MovieCast } from './movie-cast';

export function MovieDetailsContent({
  movie,
  titleId,
}: {
  movie: MovieDetails;
  titleId: string;
}) {
  const year = movie.release_date?.slice(0, 4);
  return (
    <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-7">
      <div className="relative mx-auto aspect-[2/3] w-40 self-start overflow-hidden rounded-xl border border-white/10 sm:w-48 md:w-full">
        <MediaImage
          src={movie.poster_url}
          alt={`Pôster de ${movie.title}`}
          sizes="(max-width: 767px) 192px, 220px"
        />
      </div>
      <div className="min-w-0">
        <h2
          id={titleId}
          className="pr-8 text-2xl leading-tight font-bold tracking-tight sm:text-3xl"
        >
          {movie.title}{' '}
          {year && (
            <span className="ml-2 whitespace-nowrap text-sm font-normal tracking-normal text-muted">
              ({year})
            </span>
          )}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="inline-flex shrink-0 items-center gap-2">
            <Icon
              name="star"
              fill="currentColor"
              className="size-5 text-[#ffcc4d]"
            />
            {movie.vote_average !== null ? (
              <span
                aria-label={`Nota média no TMDB: ${movie.vote_average.toFixed(1)} de 10`}
              >
                <strong>{movie.vote_average.toFixed(1)}</strong>
                <span className="text-muted">/10</span>
              </span>
            ) : (
              <span className="text-muted">Sem nota</span>
            )}
          </span>
          {movie.genres.length > 0 && (
            <>
              <span aria-hidden="true" className="text-[#5b5066]">
                |
              </span>
              <p className="text-xs leading-5 text-[#c4bdcf]">
                {movie.genres.map((genre) => genre.name).join(', ')}
              </p>
            </>
          )}
        </div>
        <p className="mt-5 text-sm leading-7 text-[#eee9f4]">
          {movie.synopsis || 'Sinopse não disponível para este filme.'}
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#e0d8e9]">
          <div className="flex items-center gap-2">
            <dt>
              <Icon name="calendar" className="size-4 text-[#a295b4]" />
              <span className="sr-only">Data de lançamento</span>
            </dt>
            <dd>
              {movie.release_date ? (
                <time dateTime={movie.release_date}>
                  {formatReleaseDate(movie.release_date)}
                </time>
              ) : (
                formatReleaseDate(null)
              )}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt>
              <Icon name="clock" className="size-4 text-[#a295b4]" />
              <span className="sr-only">Duração</span>
            </dt>
            <dd>{formatRuntime(movie.runtime_minutes)}</dd>
          </div>
        </dl>
        <MovieCast cast={movie.cast} />
      </div>
    </div>
  );
}
