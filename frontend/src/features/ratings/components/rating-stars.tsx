'use client';

import { useId, useState } from 'react';

import { Icon } from '../../../components/ui/icon';
import type { RatingScore } from '../types';

const scores: RatingScore[] = [1, 2, 3, 4, 5];

export function RatingStars({
  value,
  onChange,
  disabled,
}: {
  value: RatingScore | 0;
  onChange: (score: RatingScore) => void;
  disabled: boolean;
}) {
  const name = useId();
  const [hovered, setHovered] = useState<RatingScore | 0>(0);
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-sm font-semibold">Sua avaliação</legend>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {scores.map((score) => (
          <label
            key={score}
            onMouseEnter={() => {
              if (!disabled) setHovered(score);
            }}
            className={`relative rounded-sm ${disabled ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
          >
            <input
              type="radio"
              name={name}
              value={score}
              checked={value === score}
              onChange={() => onChange(score)}
              aria-label={`${score} ${score === 1 ? 'estrela' : 'estrelas'}`}
              className="peer absolute inset-0 z-10 m-0 size-full cursor-inherit opacity-0"
            />
            <span className="block rounded-sm p-0.5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              <Icon
                name="star"
                fill={score <= (hovered || value) ? 'currentColor' : 'none'}
                className={`size-7 transition-colors ${score <= (hovered || value) ? 'text-[#ffcc4d]' : 'text-[#74677f]'}`}
              />
            </span>
          </label>
        ))}
      </div>
      <span className="sr-only">
        {value
          ? `${value} de 5 estrelas selecionadas`
          : 'Selecione uma nota de 1 a 5'}
      </span>
    </fieldset>
  );
}
