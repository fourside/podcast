import { format, parse } from "std/datetime";
import { sprintf } from "std/fmt/printf";

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
  return sprintf("%02d:%02d:%02d", hour, min, 0);
}

export function formatDateTime(date: Date): string {
  return format(date, "yyyy/MM/dd HH:mm");
}

export function isoDateTime(date: Date): string {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

export function parseAsFromTime(fromTime: string): Date {
  return parse(fromTime, "yyyyMMddHHmm");
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 1000 * 60);
}

export function formatTimefreeDateTime(date: Date): string {
  return format(date, "yyyyMMddHHmmss");
}
