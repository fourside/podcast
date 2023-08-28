import * as log from "std/log";
import { LogRecord } from "std/log";

class CustomConsoleHandler extends log.handlers.BaseHandler {
  override format(logRecord: LogRecord): string {
    return super.format(logRecord);
  }
  override log(msg: string) {
    console.log(msg);
  }
}

log.setup({
  handlers: {
    console: new CustomConsoleHandler(
      "INFO",
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
      level: "INFO",
      handlers: ["console"],
    },
    sqs: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

export const commonLogger = log.getLogger("common");
export const batchLogger = log.getLogger("batch");
export const sqsLogger = log.getLogger("sqs");
