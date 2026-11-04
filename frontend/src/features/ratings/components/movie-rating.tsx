'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

import { Icon } from '../../../components/ui/icon';
import { useMovieRating } from '../hooks/use-movie-rating';
import { useRatingActions } from '../hooks/use-rating-actions';
import { DeleteRatingButton } from './delete-rating-button';
import { RatingStars } from './rating-stars';
import { AuthRequired } from '../../auth/components/auth-required';

export function MovieRating(props: { movieId: number; title: string }) {
  return (
    <AuthRequired>
      <MovieRatingForm {...props} />
    </AuthRequired>
  );
}

function MovieRatingForm({
  movieId,
  title,
}: {
  movieId: number;
  title: string;
}) {
  const {
    rating,
    score,
    status,
    error: loadError,
    retry,
    selectScore,
    setRating,
  } = useMovieRating(movieId);
  const { save, remove, action, error } = useRatingActions(movieId);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!score || action) return;
    setMessage('');
    const saved = await save(score, rating !== null);
    if (saved) {
      setRating(saved);
      setMessage('Avaliação salva.');
    }
  }
  async function deleteSavedRating() {
    setMessage('');
    if (await remove()) {
      setRating(null);
      setMessage('Avaliação removida.');
    }
  }

  return (
    <section
      aria-label="Sua avaliação do filme"
      className="mt-5 border-t border-white/8 pt-4"
    >
      {status === 'loading' ? (
        <p role="status" className="flex items-center gap-2 text-sm text-muted">
          <Icon name="spinner" className="size-4 animate-spin" />
          Carregando sua avaliação…
        </p>
      ) : status === 'error' ? (
        <div role="alert" className="text-sm text-[#e4b8ce]">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-3 rounded text-accent underline underline-offset-4"
          >
            Tentar carregar avaliação novamente
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <RatingStars
              value={score}
              disabled={action !== null}
              onChange={(value) => {
                selectScore(value);
                setMessage('');
              }}
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!score || score === rating?.score || action !== null}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b47bff,#9254ec)] px-5 py-2 text-sm font-semibold text-[#160a29] shadow-[0_0_25px_#a36aff25] transition hover:brightness-110 disabled:cursor-default disabled:opacity-45"
              >
                {action === 'saving' && (
                  <Icon name="spinner" className="size-4 animate-spin" />
                )}
                {action === 'saving' ? 'Salvando…' : 'Salvar avaliação'}
              </button>
              {rating && (
                <DeleteRatingButton
                  title={title}
                  onDelete={deleteSavedRating}
                  pending={action === 'deleting'}
                  disabled={action !== null}
                />
              )}
            </div>
          </div>
          {message && (
            <p role="status" className="mt-3 text-xs text-[#c4a4ed]">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-[#e4b8ce]">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
