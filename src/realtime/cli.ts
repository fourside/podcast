import { parseArgs as parse } from "std/cli";

import { getLogger } from "../logger.ts";
import { version } from "../version.ts";

type ReturnValue = {
  exit: true;
  exitCode: 0 | -1;
} | {
  exit: false;
  station: string;
  duration: number;
  title: string;
  artist: string;
};

const commandName = "rec_radiko";

export function parseArgs(args: string[]): ReturnValue {
  const logger = getLogger("realtime");
  const parsed = parse(args);
  if (parsed.version || parsed.v) {
    logger.info(`${commandName} version: ${version.version}`);
    return { exit: true, exitCode: 0 };
  }
  if (parsed.help || parsed.h) {
    showUsage();
    return { exit: true, exitCode: 0 };
  }

  const station = parsed.station || parsed.s;
  if (station === undefined) {
    logger.warning("station not be passed via --station or -s");
    return { exit: true, exitCode: -1 };
  }

  const durationString = parsed.duration || parsed.d;
  if (durationString === undefined) {
    logger.warning("duration not be passed via --duration or -d");
    return { exit: true, exitCode: -1 };
  }
  const duration = parseInt(durationString, 10);
  if (isNaN(duration)) {
    logger.warning("duration is not a number:", durationString);
    return { exit: true, exitCode: -1 };
  }

  const title = parsed.title || parsed.t;
  if (title === undefined) {
    logger.warning("title not be passed via --title or -t");
    return { exit: true, exitCode: -1 };
  }

  const artist = parsed.artist || parsed.a;
  if (artist === undefined) {
    logger.warning("artist not be passed via --artist or -a");
    return { exit: true, exitCode: -1 };
  }

  return { exit: false, station, duration, title, artist };
}

function showUsage() {
  const logger = getLogger("realtime");
  logger.info(
    `usage: ${commandName} --station <station> --duration <duration> --title <title> --artist <artist>`,
  );
}
