import { AppShell } from '../components/layout/app-shell';
import { MovieSearch } from '../features/movies/components/movie-search';

export default function Home() {
  return (
    <AppShell>
      <MovieSearch />
    </AppShell>
  );
}
