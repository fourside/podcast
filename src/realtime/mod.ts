import Sentry from "x/sentry";
import { authorize } from "../auth-client.ts";
import { getDateIfMidnightThenSubtracted } from "../date.ts";
import { Env } from "../env.ts";
import { getLogger, setupLog } from "../logger.ts";
import { getOutputFilename } from "../output-filename.ts";
import { sendMessageToSlack } from "../slack-client.ts";
import { getPlaylistXml } from "../xml-client.ts";
import { getPlaylistUriFromXml } from "../xml-parser.ts";
import { parseArgs } from "./cli.ts";
import { record } from "./record.ts";

export async function main(args: string[]) {
  setupLog(Env.isProduction ? "INFO" : "DEBUG");
  const logger = getLogger("realtime");

  const result = parseArgs(args);
  if (result.exit) {
    Deno.exit(result.exitCode);
  }
  logger.info(`record start. ${args}`);
  const { station, duration, title, artist } = result;
  try {
    await realtime({ station, duration, title, artist });
    logger.info("record end.");
  } catch (error) {
    logger.error("record failed.", error);
    try {
      await sendMessageToSlack(Env.webhookUrl, error.message, {
        title,
        artist,
      });
    } catch (slackError) {
      logger.error("Send slack failed.", slackError);
    }
    throw error;
  }
}

type Params = {
  station: string;
  duration: number;
  title: string;
  artist: string;
};

async function realtime(params: Params): Promise<void> {
  const authToken = await authorize();
  const xml = await getPlaylistXml(params.station);
  const playListUrl = getPlaylistUriFromXml(xml);
  const recordDate = getDateIfMidnightThenSubtracted(new Date());
  const outputFileName = getOutputFilename(params.title, recordDate);
  await record(
    {
      station: params.station,
      duration: params.duration,
      title: params.title,
      artist: params.artist,
      year: recordDate.getFullYear(),
      outputFileName,
    },
    authToken,
    playListUrl,
  );
}

if (import.meta.main) {
  Sentry.init({ dsn: Env.sentryDsn });
  try {
    await main(Deno.args);
  } catch (error) {
    Sentry.captureException(error);
    Deno.exit(-1);
  }
}
