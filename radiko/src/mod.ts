import { authorize } from "./auth-client.ts";
import { getDateIfMidnightThenSubtracted } from "./date.ts";
import { parseArgs } from "./cli.ts";
import { getOutputFilename } from "./output-filename.ts";
import { record } from "./recorder.ts";
import { getPlaylistXml } from "./xml-client.ts";
import { getPlaylistUriFromXml } from "./xml-parser.ts";
import { sendMessageToSlack } from "./slack-client.ts";

export async function main(args: string[]) {
  const result = parseArgs(args);
  if (result.exit) {
    Deno.exit(result.exitCode);
  }
  console.log("record start.", new Date()); // more specific
  const { station, duration, title, artist } = result;
  try {
    const authToken = await authorize();
    const xml = await getPlaylistXml(station);
    const playListUrl = getPlaylistUriFromXml(xml);
    const recordDate = getDateIfMidnightThenSubtracted(new Date());
    const outputFileName = getOutputFilename(title, recordDate);
    await record(
      {
        station,
        duration,
        title,
        artist,
        year: recordDate.getFullYear(),
        outputFileName,
      },
      authToken,
      playListUrl,
    );
    console.log("record end.", new Date());
  } catch (error) {
    console.error("record failed.", error);
    try {
      await sendMessageToSlack(error.message, title, artist);
    } catch (slackError) {
      console.error("Send slack failed.", slackError);
    }
    Deno.exit(-1);
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
