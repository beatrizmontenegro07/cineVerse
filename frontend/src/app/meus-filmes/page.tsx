import type { Metadata } from 'next';

import { AppShell } from '../../components/layout/app-shell';
import { RatedMovies } from '../../features/ratings/components/rated-movies';

export const metadata: Metadata = { title: 'Meus Filmes | CineVerse' };

export default function RatedMoviesPage() {
  return (
    <AppShell>
      <RatedMovies />
    </AppShell>
  );
}
