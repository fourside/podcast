import { formatTimeForFfmpeg } from "./date.ts";
import { RecRadikoError } from "./rec-radiko-error.ts";
import { moveSync } from "std/fs";

export type RecordMeta = {
  station: string;
  duration: number;
  title: string;
  artist: string;
  year: number;
  outputFileName: string;
};

export async function record(
  recordMeta: RecordMeta,
  authToken: string,
  playListUrl: string,
): Promise<void> {
  const commands = [
    "ffmpeg",
    "-loglevel",
    "error",
    "-fflags",
    "+discardcorrupt",
    "-headers",
    `X-Radiko-Authtoken: ${authToken}`,
    "-i",
    playListUrl,
    "-b:a",
    "128k",
    "-y",
    "-t",
    formatTimeForFfmpeg(recordMeta.duration),
    "-metadata",
    `title=${recordMeta.title}`,
    "-metadata",
    `artist=${recordMeta.artist}`,
    "-metadata",
    `year=${recordMeta.year}`,
    recordMeta.outputFileName,
  ];
  const { status, stdout, stderr } = await runPipedProcess(commands);
  console.log("ffmpeg:", status);
  if (status.success) {
    console.log(new TextDecoder().decode(stdout));
    moveFile(recordMeta.outputFileName, `/public/${recordMeta.outputFileName}`);
  } else {
    const error = new TextDecoder().decode(stderr);
    throw new RecRadikoError(error);
  }
}

type RecordTimefreeMeta = {
  station: string;
  fromTime: string;
  toTime: string;
  title: string;
  artist: string;
  year: number;
  outputFileName: string;
};

export async function recordTimefree(
  recordMeta: RecordTimefreeMeta,
  authToken: string,
): Promise<void> {
  const commands = [
    "ffmpeg",
    "-loglevel",
    "error",
    "-fflags",
    "+discardcorrupt",
    "-headers",
    `X-Radiko-Authtoken: ${authToken}`,
    "-i",
    `https://radiko.jp/v2/api/ts/playlist.m3u8?station_id=${recordMeta.station}&l=15&ft=${recordMeta.fromTime}&to=${recordMeta.toTime}`,
    "-b:a",
    "128k",
    "-y",
    "-metadata",
    `title=${recordMeta.title}`,
    "-metadata",
    `artist=${recordMeta.artist}`,
    "-metadata",
    `year=${recordMeta.year}`,
    recordMeta.outputFileName,
  ];
  const { status, stdout, stderr } = await runPipedProcess(commands);
  console.log("ffmpeg:", status);
  if (status.success) {
    console.log(new TextDecoder().decode(stdout));
    moveFile(recordMeta.outputFileName, `/public/${recordMeta.outputFileName}`);
  } else {
    const error = new TextDecoder().decode(stderr);
    throw new RecRadikoError(error);
  }
}

async function runPipedProcess(cmd: string[]): Promise<
  { status: Deno.ProcessStatus; stdout: Uint8Array; stderr: Uint8Array }
> {
  const process = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
  const [status, stdout, stderr] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);
  process.close();
  return { status, stdout, stderr };
}

function moveFile(filePath: string, targetPath: string): void {
  moveSync(filePath, targetPath);
}
