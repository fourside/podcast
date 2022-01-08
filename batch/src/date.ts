import { sprintf } from "std/fmt/printf";
import { format } from "std/datetime";

export function getDateIfMidnightThenSubtracted(date: Date): Date {
  const hour = date.getHours();
  if (hour >= 0 && hour <= 3) {
    return new Date(date.getTime() - 1000 * 60 * 60 * 24);
  }
  return new Date(date.getTime());
}

export function formatTimeForFfmpeg(duration: number): string {
  const hour = Math.floor(duration / 60);
  const min = duration % 60;
  return sprintf("%02d%02d%02d", hour, min, 0);
}

export function formatDateTime(date: Date): string {
  return format(date, "yyyy/MM/dd HH:mm");
}
