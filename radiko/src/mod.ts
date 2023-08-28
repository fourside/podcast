import { authorize } from "./auth-client.ts";
import { parseArgs } from "./cli.ts";
import { getDateIfMidnightThenSubtracted } from "./date.ts";
import { batchLogger as logger } from "./logger.ts";
import { getOutputFilename } from "./output-filename.ts";
import { record } from "./recorder.ts";
import { sendMessageToSlack } from "./slack-client.ts";
import { getPlaylistXml } from "./xml-client.ts";
import { getPlaylistUriFromXml } from "./xml-parser.ts";

export async function main(args: string[]) {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (webhookUrl === undefined) {
    throw new Error("SLACK_WEBHOOK_URL is not passed.");
  }

  const result = parseArgs(args);
  if (result.exit) {
    Deno.exit(result.exitCode);
  }
  logger.info(`record start. ${args}`);
  const { station, duration, title, artist } = result;
  try {
    await batch({ station, duration, title, artist });
    logger.info("record end.");
  } catch (error) {
    logger.error("record failed.", error);
    try {
      await sendMessageToSlack(webhookUrl, error.message, title, artist);
    } catch (slackError) {
      logger.error("Send slack failed.", slackError);
    }
    Deno.exit(-1);
  }
}

type RecordValue = {
  station: string;
  duration: number;
  title: string;
  artist: string;
};

async function batch(recordValue: RecordValue): Promise<void> {
  const authToken = await authorize();
  const xml = await getPlaylistXml(recordValue.station);
  const playListUrl = getPlaylistUriFromXml(xml);
  const recordDate = getDateIfMidnightThenSubtracted(new Date());
  const outputFileName = getOutputFilename(recordValue.title, recordDate);
  await record(
    {
      station: recordValue.station,
      duration: recordValue.duration,
      title: recordValue.title,
      artist: recordValue.artist,
      year: recordDate.getFullYear(),
      outputFileName,
    },
    authToken,
    playListUrl,
  );
}

if (import.meta.main) {
  await main(Deno.args);
}
