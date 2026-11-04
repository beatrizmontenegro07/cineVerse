'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Checking connection…');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/health/', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Service unavailable');
        const health = await response.json();
        if (health.status !== 'ok' || health.database !== 'ok') {
          throw new Error('Service unavailable');
        }
        setStatus('Backend and database are ready.');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('Unable to connect to the backend.');
      });
    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>cineVerse</h1>
      <p>Movie search and ratings are coming soon.</p>
      <p role="status">{status}</p>
    </main>
  );
}

