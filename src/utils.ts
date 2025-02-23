export function getDateString(timestring: string) {
  const date = new Date(timestring);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = String(date.getDate());
  const year = String(date.getFullYear());

  return `${month} ${day}, ${year}`;
}
