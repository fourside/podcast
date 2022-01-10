import { format } from "std/datetime";

export function getOutputFilename(title: string, date: Date): string {
  const suffix = format(date, "yyyyMMdd");
  return `${title}-${suffix}.mp3`;
}
