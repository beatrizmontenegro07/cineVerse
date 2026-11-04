'use client';

import { Icon } from '../../../components/ui/icon';
import { MediaImage } from '../../../components/ui/media-image';
import { useRatingActions } from '../hooks/use-rating-actions';
import type { Rating } from '../types';
import { DeleteRatingButton } from './delete-rating-button';

export function RatedMovieRow({
  rating,
  onDetails,
  onDeleted,
}: {
  rating: Rating;
  onDetails: (rating: Rating) => void;
  onDeleted: (title: string) => void;
}) {
  const { remove, action, error } = useRatingActions(rating.movie_id);
  async function deleteSaved() {
    if (await remove()) onDeleted(rating.title);
  }
  return (
    <li className="rounded-xl border border-white/4 bg-[linear-gradient(110deg,#1b1525,#14111c)] px-3 py-3 sm:px-5">
      <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:grid-cols-[64px_minmax(0,1fr)_90px_auto]">
        <button
          type="button"
          onClick={() => onDetails(rating)}
          aria-label={`Ver detalhes de ${rating.title}`}
          className="relative row-span-2 aspect-[2/3] w-13 overflow-hidden rounded-md border border-white/8 sm:row-span-1 sm:w-16"
        >
          <MediaImage
            src={rating.poster_url}
            alt={`Pôster de ${rating.title}`}
            sizes="64px"
            fallbackLabel=""
          />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold" title={rating.title}>
            {rating.title}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {rating.release_date
              ? `(${rating.release_date.slice(0, 4)})`
              : 'Ano não informado'}
          </p>
        </div>
        <span
          aria-label={`Sua nota: ${rating.score} de 5`}
          className="col-start-2 row-start-2 flex items-center gap-2 text-sm sm:col-auto sm:row-auto"
        >
          <Icon
            name="star"
            fill="currentColor"
            className="size-5 text-[#ffcc4d]"
          />
          {rating.score.toFixed(1)}
        </span>
        <div className="col-span-2 flex justify-end gap-3 sm:col-span-1">
          <button
            type="button"
            onClick={() => onDetails(rating)}
            className="rounded-full border border-accent/70 px-4 py-2 text-xs font-medium text-[#c599fa] transition hover:bg-accent/10"
          >
            Ver detalhes<span className="sr-only"> de {rating.title}</span>
          </button>
          <DeleteRatingButton
            title={rating.title}
            onDelete={deleteSaved}
            pending={action === 'deleting'}
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#e4b8ce]">
          {error}
        </p>
      )}
    </li>
  );
}
