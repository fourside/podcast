import Sentry from "x/sentry";
import { authorize } from "../auth-client.ts";
import { Env } from "../env.ts";
import { getLogger, setupLog } from "../logger.ts";
import { sendMessageToSlack } from "../slack-client.ts";
import { convert } from "./convert.ts";
import { record } from "./record.ts";
import { type Task, TasksSchema } from "./schema.ts";

export async function main(_: string[]) {
  setupLog(Env.isProduction ? "INFO" : "DEBUG");

  try {
    await readQueue();
  } catch (error) {
    const logger = getLogger("queue");
    logger.error(error);
    try {
      const programInfo = error instanceof QueueError
        ? { title: error.task.title, artist: error.task.personality }
        : undefined;
      await sendMessageToSlack(
        Env.webhookUrl,
        error.message,
        programInfo,
      );
    } catch (slackError) {
      logger.error("Send slack failed.", slackError);
    }
    throw error;
  }
}

async function readQueue(): Promise<void> {
  const tasks = await fetchTasks();
  for (const task of tasks) {
    try {
      const result = await convert(task);
      switch (result.type) {
        case "in_the_future":
          break;
        case "success": {
          const authToken = await authorize();
          await record(result.program, authToken);
          await deleteTask(task.id);
          break;
        }
        case "already_done":
        case "over_a_week":
          await deleteTask(task.id);
          break;
        default:
          throw new Error(`not handled convert result type: ${result}`);
      }
    } catch (error) {
      throw new QueueError(error.message, task, { cause: error.cause });
    }
  }
}

class QueueError extends Error {
  public readonly task: Task;
  constructor(message: string, task: Task, options: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.task = task;
  }
}

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${Env.queueUrl}/tasks`, {
    headers: {
      Authorization: `Basic ${
        btoa(`${Env.queueUsername}:${Env.queuePassword}`)
      }`,
    },
  });
  const json = await res.json();
  return TasksSchema.parse(json);
}

async function deleteTask(id: string): Promise<void> {
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
  Sentry.init({ dsn: Env.sentryDsn });
  try {
    await main(Deno.args);
  } catch (error) {
    Sentry.captureException(error);
    Deno.exit(-1);
  }
}
