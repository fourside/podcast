import {
  addMinutes,
  formatTimefreeDateTime,
  getDateIfMidnightThenSubtracted,
  parseAsFromTime,
} from "../date.ts";
import { getLogger } from "../logger.ts";
import { getOutputFilename } from "../output-filename.ts";
import type { RecordTimefree } from "./record.ts";
import type { Program } from "./schema.ts";

export async function convert(
  program: Program,
): Promise<RecordTimefree | undefined> {
  const logger = getLogger("queue");
  const fromDate = parseAsFromTime(program.fromTime);
  const toDate = addMinutes(
    fromDate,
    Number.parseInt(program.duration, 10),
  );
  if (toDate.getTime() > Date.now()) {
    return;
  }

  const recordDate = getDateIfMidnightThenSubtracted(fromDate);
  const fileName = getOutputFilename(program.title, recordDate);

  const isAlreadyRecoded = await fileExists(fileName);
  if (isAlreadyRecoded) {
    logger.info(`already handled message: title: ${program.title}`);
    return;
  }
  return {
    station: program.stationId,
    title: program.title,
    artist: program.personality,
    fromTime: formatTimefreeDateTime(fromDate),
    toTime: formatTimefreeDateTime(toDate),
    year: fromDate.getFullYear(),
    outputFileName: fileName,
  };
}

async function fileExists(fileName: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(fileName);
    return stat.isFile;
  } catch (_error) {
    return false;
  }
}
