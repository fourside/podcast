import { copySync } from "std/fs/copy";
import { formatTimeForFfmpeg } from "./date.ts";
import { batchLogger, sqsLogger } from "./logger.ts";
import { RecRadikoError } from "./rec-radiko-error.ts";

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
  const command = "ffmpeg";
  const args = [
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
  const { success, stdout, stderr } = await runCommand(command, args);
  if (success) {
    batchLogger.info(new TextDecoder().decode(stdout));
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
  const command = "ffmpeg";
  const args = [
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
  const { success, stdout, stderr } = await runCommand(command, args);
  if (success) {
    sqsLogger.info(new TextDecoder().decode(stdout));
    moveFile(recordMeta.outputFileName, `/public/${recordMeta.outputFileName}`);
  } else {
    const error = new TextDecoder().decode(stderr);
    throw new RecRadikoError(error);
  }
}

async function runCommand(
  commandStr: string,
  args: string[],
): Promise<{ success: boolean; stdout: Uint8Array; stderr: Uint8Array }> {
  const command = new Deno.Command(commandStr, {
    args,
    stdout: "piped",
    stderr: "piped",
  });
  const { success, stdout, stderr } = await command.output();
  return { success, stdout, stderr };
}

function moveFile(filePath: string, targetPath: string): void {
  copySync(filePath, targetPath);
  Deno.removeSync(filePath);
}
