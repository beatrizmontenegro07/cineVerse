export function formatReleaseDate(value: string | null) {
  if (!value) return 'Lançamento não informado';
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatRuntime(minutes: number | null) {
  if (!minutes) return 'Duração não informada';
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return [hours ? `${hours}h` : '', remaining ? `${remaining}min` : '']
    .filter(Boolean)
    .join(' ');
}
