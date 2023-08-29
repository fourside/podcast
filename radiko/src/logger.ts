import * as log from "std/log";
import { LogRecord } from "std/log";
import { Env } from "./env.ts";

class CustomConsoleHandler extends log.handlers.BaseHandler {
  override format(logRecord: LogRecord): string {
    return super.format(logRecord);
  }
  override log(msg: string) {
    console.log(msg);
  }
}

const logLevel: log.LevelName = Env.isProduction ? "INFO" : "DEBUG";

log.setup({
  handlers: {
    console: new CustomConsoleHandler(
      logLevel,
      {
        formatter: (log) => {
          const date = new Date().toISOString();
          return `${date} [${log.loggerName}] [${log.levelName}] ${log.msg}`;
        },
      },
    ),
  },
  loggers: {
    batch: {
      level: logLevel,
      handlers: ["console"],
    },
    sqs: {
      level: logLevel,
      handlers: ["console"],
    },
  },
});

export const commonLogger = log.getLogger("common");
export const batchLogger = log.getLogger("batch");
export const sqsLogger = log.getLogger("sqs");
