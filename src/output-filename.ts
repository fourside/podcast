import { format } from "std/datetime";

export const FILE_DIR = "files";

export function getOutputFilename(title: string, date: Date): string {
  const suffix = format(date, "yyyyMMdd");
  return `${FILE_DIR}/${title}-${suffix}.mp3`;
}
