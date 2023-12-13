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

export function setupLog(logLevel: log.LevelName): void {
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
      realtime: {
        level: logLevel,
        handlers: ["console"],
      },
      queue: {
        level: logLevel,
        handlers: ["console"],
      },
    },
  });
}

export const getLogger = (app: "realtime" | "queue" | "common") =>
  log.getLogger(app);
