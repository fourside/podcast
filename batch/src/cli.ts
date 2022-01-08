import { parse } from "std/flags";

import { version } from "./version.ts";

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
  const parsed = parse(args);
  if (parsed.version || parsed.v) {
    console.log(`${commandName} version: ${version.version}`);
    return { exit: true, exitCode: 0 };
  }
  if (parsed.help || parsed.h) {
    showUsage();
    return { exit: true, exitCode: 0 };
  }
  const station = parsed.station || parsed.s;
  if (station === undefined) {
    console.log("station not be passed via --station or -s");
    return { exit: true, exitCode: -1 };
  }

  const durationString = parsed.duration || parsed.d;
  if (durationString === undefined) {
    console.log("duration not be passed via --duration or -d");
    return { exit: true, exitCode: -1 };
  }
  const duration = parseInt(durationString, 10);
  if (isNaN(duration)) {
    console.log("duration is not a number:", durationString);
    return { exit: true, exitCode: -1 };
  }

  const title = parsed.title || parsed.t;
  if (title === undefined) {
    console.log("title not be passed via --title or -t");
    return { exit: true, exitCode: -1 };
  }

  const artist = parsed.artist || parsed.a;
  if (artist === undefined) {
    console.log("artist not be passed via --artist or -a");
    return { exit: true, exitCode: -1 };
  }

  return { exit: false, station, duration, title, artist };
}

function showUsage() {
  console.log(
    `usage: ${commandName} --station <station> --duration <duration> --title <title> --artist <artist>`,
  );
}
