import { SearchForm } from './search-form';
import type { SearchFormProps } from './search-form';

export function SearchHero(props: SearchFormProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden px-5 pt-12 pb-10 sm:px-9 sm:pt-17 sm:pb-13 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/cinema-hero.webp')] bg-cover bg-right opacity-65"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0b0a10_5%,#0b0a10cc_40%,#0b0a1010_100%),linear-gradient(0deg,#0b0a10_0%,transparent_50%)]"
      />
      <div className="max-w-3xl">
        <h1
          id="hero-title"
          className="max-w-3xl text-[clamp(1.9rem,4.3vw,3.25rem)] leading-[1.2] font-bold tracking-[-0.035em] text-[#faf8ff]"
        >
          <br />
          Explore o universo do <span className="text-accent">cinema.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#c6bfd1] sm:text-base">
          <br className="sm:hidden" /> Encontre seu próximo filme favorito.
        </p>
        <div className="mt-8 max-w-2xl sm:mt-9">
          <SearchForm {...props} />
        </div>
      </div>
    </section>
  );
}
