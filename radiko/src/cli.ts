import { parse } from "std/flags";

import { version } from "./version.ts";

type ReturnValue = {
  exit: true;
  exitCode: 0 | -1;
} | {
  exit: false;
  timeFree: false;
  station: string;
  duration: number;
  title: string;
  artist: string;
} | {
  exit: false;
  timeFree: true;
  station: string;
  duration: number;
  title: string;
  artist: string;
  fromTime: string;
};

const commandName = "rec_radiko";

export function parseArgs(args: string[]): ReturnValue {
  const parsed = parse(args, { string: ["fromTime", "f"] });
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

  const subCommand = parsed._[0] + "";
  if (subCommand !== "timefree") {
    return { exit: false, timeFree: false, station, duration, title, artist };
  }

  const fromTime = parsed.fromTime || parsed.f;
  if (fromTime === undefined) {
    console.log("fromTime not be passed via --fromTime or -f");
    return { exit: true, exitCode: -1 };
  }
  if (!/^\d{12}$/.test(fromTime)) {
    console.log("fromTime must be 12 digits");
    return { exit: true, exitCode: -1 };
  }

  return {
    exit: false,
    timeFree: true,
    station,
    duration,
    title,
    artist,
    fromTime: fromTime,
  };
}

function showUsage() {
  console.log(
    `usage: ${commandName} --station <station> --duration <duration> --title <title> --artist <artist>`,
  );
}
