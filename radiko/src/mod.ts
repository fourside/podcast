import { authorize } from "./auth-client.ts";
import {
  addMinutes,
  formatTimefreeDateTime,
  getDateIfMidnightThenSubtracted,
  parseAsFromTime,
} from "./date.ts";
import { parseArgs } from "./cli.ts";
import { getOutputFilename } from "./output-filename.ts";
import { record, recordTimefree } from "./recorder.ts";
import { getPlaylistXml } from "./xml-client.ts";
import { getPlaylistUriFromXml } from "./xml-parser.ts";
import { sendMessageToSlack } from "./slack-client.ts";

export async function main(args: string[]) {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (webhookUrl === undefined) {
    throw new Error("SLACK_WEBHOOK_URL is not passed.");
  }

  const result = parseArgs(args);
  if (result.exit) {
    Deno.exit(result.exitCode);
  }
  console.log("record start.", args, new Date());
  const { station, duration, title, artist, timeFree } = result;
  try {
    if (timeFree) {
      await timefree({
        station,
        duration,
        title,
        artist,
        fromTime: result.fromTime,
      });
    } else {
      await batch({ station, duration, title, artist });
    }
    console.log("record end.", new Date());
  } catch (error) {
    console.error("record failed.", error);
    try {
      await sendMessageToSlack(webhookUrl, error.message, title, artist);
    } catch (slackError) {
      console.error("Send slack failed.", slackError);
    }
    Deno.exit(-1);
  }

  try {
    console.log("record end.", new Date());
  } catch (error) {
    console.error("record failed.", error);
    try {
      await sendMessageToSlack(webhookUrl, error.message, title, artist);
    } catch (slackError) {
      console.error("Send slack failed.", slackError);
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

async function timefree(
  recordValue: RecordValue & { fromTime: string },
): Promise<void> {
  const authToken = await authorize();
  const fromDate = parseAsFromTime(recordValue.fromTime);
  const recordDate = getDateIfMidnightThenSubtracted(fromDate);
  const toDate = addMinutes(fromDate, recordValue.duration);

  await recordTimefree({
    station: recordValue.station,
    title: recordValue.title,
    artist: recordValue.artist,
    fromTime: formatTimefreeDateTime(fromDate),
    toTime: formatTimefreeDateTime(toDate),
    year: recordDate.getFullYear(),
    outputFileName: getOutputFilename(recordValue.title, recordDate),
  }, authToken);
}

if (import.meta.main) {
  await main(Deno.args);
}
