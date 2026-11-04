'use client';

import { useId, useState } from 'react';

import { MediaImage } from '../../../components/ui/media-image';
import type { CastMember } from '../types';

const PREVIEW_SIZE = 4;

export function MovieCast({ cast }: { cast: CastMember[] }) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const actors = expanded ? cast : cast.slice(0, PREVIEW_SIZE);

  return (
    <section
      aria-labelledby={`${listId}-heading`}
      className="mt-5 border-t border-white/8 pt-4"
    >
      <h3 id={`${listId}-heading`} className="text-sm font-semibold">
        Elenco
      </h3>
      {actors.length ? (
        <>
          <ul
            id={listId}
            className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4"
          >
            {actors.map((actor) => (
              <li
                key={`${actor.id}-${actor.character}`}
                className="min-w-0 text-center"
              >
                <div className="relative mx-auto size-13 overflow-hidden rounded-full border border-[#61506d] bg-surface">
                  <MediaImage
                    src={actor.profile_url}
                    alt={`Foto de ${actor.name}`}
                    sizes="52px"
                    fallbackIcon="user"
                    fallbackLabel=""
                  />
                </div>
                <p className="mt-2 text-xs leading-4 font-medium">
                  {actor.name}
                </p>
                {actor.character && (
                  <p className="mt-1 text-[11px] leading-4 text-muted">
                    {actor.character}
                  </p>
                )}
              </li>
            ))}
          </ul>
          {cast.length > PREVIEW_SIZE && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={() => setExpanded((value) => !value)}
              className="mt-4 rounded text-xs font-medium text-[#bf92f6] underline-offset-4 hover:text-white hover:underline"
            >
              {expanded
                ? 'Mostrar menos'
                : `Ver elenco completo (${cast.length})`}
            </button>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm text-muted">Elenco não informado.</p>
      )}
    </section>
  );
}
