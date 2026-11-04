'use client';

import { useRef } from 'react';
import type { FormEvent } from 'react';

import { Icon } from '../../../components/ui/icon';

export interface SearchFormProps {
  value: string;
  onValueChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export function SearchForm({
  value,
  onValueChange,
  onSearch,
  onClear,
}: SearchFormProps) {
  const input = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value.trim()) onSearch(value);
  }

  function clear() {
    onClear();
    input.current?.focus();
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="group flex min-h-15 w-full items-center gap-3 rounded-full border border-[#5a456d] bg-[#171320]/90 px-4 shadow-[0_8px_40px_#0003] backdrop-blur-sm transition focus-within:border-accent  focus-within:ring-accent/10 sm:px-5"
    >
      <Icon name="search" className="size-6 shrink-0 text-[#e2dcea]" />
      <label htmlFor="movie-search" className="sr-only">
        Busque pelo nome de um filme
      </label>
      <input
        ref={input}
        id="movie-search"
        name="query"
        type="search"
        maxLength={200}
        autoComplete="off"
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
          if (!event.target.value.trim()) onClear();
        }}
        placeholder="Qual filme você quer descobrir?"
        className="min-w-0 flex-1 bg-transparent py-4 text-base text-white outline-none placeholder:text-[#9f96ac] focus-visible:outline-none!"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={clear}
          className="rounded-full p-1 text-muted transition-colors hover:text-white"
        >
          <Icon name="close" className="size-5" />
        </button>
      )}
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label="Buscar filmes"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#9b5deb] text-white transition hover:bg-[#af77fa] disabled:cursor-default disabled:bg-white/5 disabled:text-muted sm:w-auto sm:gap-2 sm:px-4"
      >
        <span className="hidden text-sm font-semibold sm:inline">Buscar</span>
        <Icon name="arrow" className="size-4" />
      </button>
    </form>
  );
}
