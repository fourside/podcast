import { authorize } from "../auth-client.ts";
import { Env } from "../env.ts";
import { getLogger, setupLog } from "../logger.ts";
import { sendTimefreeErrorMessageToSlack } from "../slack-client.ts";
import { convert } from "./convert.ts";
import { record } from "./record.ts";
import { type Program, ProgramsSchema } from "./schema.ts";

export async function main(_: string[]) {
  setupLog(Env.isProduction ? "INFO" : "DEBUG");

  try {
    await readQueue();
  } catch (error) {
    const logger = getLogger("queue");
    logger.error(error);
    try {
      await sendTimefreeErrorMessageToSlack(Env.webhookUrl, error.message);
    } catch (slackError) {
      logger.error("Send slack failed.", slackError);
    }
    Deno.exit(-1);
  }
}

async function readQueue(): Promise<void> {
  const programs = await fetchPrograms();
  for (const program of programs) {
    try {
      const recordTimefree = await convert(program);
      if (recordTimefree === undefined) {
        continue;
      }
      const authToken = await authorize();
      await record(recordTimefree, authToken);
      await deleteProgram(program.id);
    } catch (error) {
      throw error;
    }
  }
}

async function fetchPrograms(): Promise<Program[]> {
  const res = await fetch(`${Env.queueUrl}/tasks`, {
    headers: {
      Authorization: `Basic ${
        btoa(`${Env.queueUsername}:${Env.queuePassword}`)
      }`,
    },
  });
  const json = await res.json();
  return ProgramsSchema.parse(json);
}

async function deleteProgram(id: string): Promise<void> {
  await fetch(`${Env.queueUrl}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${
        btoa(`${Env.queueUsername}:${Env.queuePassword}`)
      }`,
    },
  });
}

if (import.meta.main) {
  await main(Deno.args);
}
