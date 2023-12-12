import { formatTimeForFfmpeg } from "../date.ts";
import { run } from "../ffmpeg.ts";
import { getLogger } from "../logger.ts";
import { putMp3 } from "../r2-client.ts";
import { RecRadikoError } from "../rec-radiko-error.ts";

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
  const logger = getLogger("realtime");
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
  const { success, stdout, stderr } = await run(args);
  if (success) {
    logger.info(new TextDecoder().decode(stdout));
    await putMp3(recordMeta.outputFileName);
  } else {
    const error = new TextDecoder().decode(stderr);
    throw new RecRadikoError(error);
  }
}
