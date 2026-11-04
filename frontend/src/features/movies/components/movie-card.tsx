'use client';

import { MediaImage } from '../../../components/ui/media-image';
import type { Movie } from '../types';

export function MovieCard({
  movie,
  onSelect,
}: {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}) {
  return (
    <li className="min-w-0">
      <article
        aria-label={movie.title}
        className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-[#3a3147] bg-[#17131e] shadow-[0_6px_20px_#0003] transition duration-300 hover:-translate-y-1 hover:border-accent/65 hover:shadow-[0_8px_30px_#9159e61a]"
      >
        <MediaImage
          src={movie.poster_url}
          alt={`Pôster de ${movie.title}`}
          sizes="(max-width: 639px) 45vw, (max-width: 767px) 30vw, (max-width: 1023px) 23vw, 220px"
          imageClassName="transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070ded] via-[#08070d05] to-transparent" />
        <h3
          title={movie.title}
          className="absolute inset-x-0 bottom-0 line-clamp-3 px-3 pt-9 pb-4 text-sm leading-snug font-bold text-white sm:px-4 sm:text-base"
        >
          {movie.title}
        </h3>
        <button
          type="button"
          onClick={() => onSelect(movie)}
          aria-label={`Ver detalhes de ${movie.title}`}
          aria-haspopup="dialog"
          className="absolute inset-0 rounded-xl focus-visible:-outline-offset-4"
        />
      </article>
    </li>
  );
}
