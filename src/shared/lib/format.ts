const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDueDate(iso: string): string {
  return formatter.format(new Date(iso));
}
