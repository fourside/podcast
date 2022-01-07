export function getDateIfMidnightThenSubtracted(date: Date): Date {
  const hour = date.getHours();
  if (hour >= 0 && hour <= 3) {
    return new Date(date.getTime() - 1000 * 60 * 60 * 24);
  }
  return new Date(date.getTime());
}
