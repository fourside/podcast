import { run } from "../ffmpeg.ts";
import { getLogger } from "../logger.ts";
import { putMp3 } from "../r2-client.ts";
import { RecRadikoError } from "../rec-radiko-error.ts";

type RecordTimefreeMeta = {
  station: string;
  fromTime: string;
  toTime: string;
  title: string;
  artist: string;
  year: number;
  outputFileName: string;
};

export async function record(
  recordMeta: RecordTimefreeMeta,
  authToken: string,
): Promise<void> {
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
  const { success, stdout, stderr } = await run(args);
  if (success) {
    const logger = getLogger("queue");
    logger.info(new TextDecoder().decode(stdout));

    await putMp3(recordMeta.outputFileName);
  } else {
    const error = new TextDecoder().decode(stderr);
    throw new RecRadikoError(error);
  }
}
