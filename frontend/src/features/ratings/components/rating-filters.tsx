import type { FormEvent } from 'react';

import { useRatingFilterOptions } from '../hooks/use-rating-filter-options';
import type { RatingFilters } from '../types';

interface RatingFiltersProps {
  value: RatingFilters;
  onChange: (filters: RatingFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

const fieldClass =
  'min-h-11 w-full rounded-lg border border-[#4c3a60] bg-[#171320] px-3 text-sm text-[#eee6f8] focus:border-accent';

export function RatingFilters({
  value,
  onChange,
  onApply,
  onClear,
}: RatingFiltersProps) {
  const { options, status, retry } = useRatingFilterOptions();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply();
  }
  return (
    <form
      onSubmit={submit}
      className="mb-7 rounded-xl "
    >
      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          Filtrar meus filmes
        </legend>
        <div className="grid grid-cols-2 items-end gap-3 sm:flex sm:flex-wrap">
          <label className="min-w-0 text-xs text-muted sm:w-56">
            <span className="mb-1.5 block">Gênero</span>
            <select
              name="genre"
              value={value.genre}
              disabled={status === 'loading'}
              onChange={(event) =>
                onChange({ ...value, genre: event.target.value })
              }
              className={fieldClass}
            >
              <option value="">Todos os gêneros</option>
              {value.genre &&
                !options.genres.some(
                  (genre) => String(genre.id) === value.genre,
                ) && <option value={value.genre}>Gênero selecionado</option>}
              {options.genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted sm:w-40">
            <span className="mb-1.5 block">Ano de lançamento</span>
            <select
              name="year"
              value={value.year}
              disabled={status === 'loading'}
              onChange={(event) =>
                onChange({ ...value, year: event.target.value })
              }
              className={fieldClass}
            >
              <option value="">Todos os anos</option>
              {value.year && !options.years.includes(Number(value.year)) && (
                <option value={value.year}>{value.year}</option>
              )}
              {options.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="min-h-11 rounded-full bg-[#9758ed] px-5 text-sm font-semibold text-white transition hover:bg-[#ad75f5]"
          >
            Aplicar filtros
          </button>
          {(value.genre || value.year) && (
            <button
              type="button"
              onClick={onClear}
              className="min-h-11 rounded px-2 text-xs font-medium text-[#c79aff] underline-offset-4 hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </fieldset>
      {status === 'loading' && (
        <p role="status" className="mt-2 text-xs text-muted">
          Carregando opções dos filmes avaliados…
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-2 text-xs text-[#e4b8ce]">
          Não foi possível carregar as opções.{' '}
          <button
            type="button"
            onClick={retry}
            className="rounded underline underline-offset-2"
          >
            Tentar novamente
          </button>
        </p>
      )}
    </form>
  );
}
