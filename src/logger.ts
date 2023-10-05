import * as log4js from "log4js";

class Logger {
  private logger: log4js.Logger;

  constructor() {
    log4js.configure({
      appenders: { out: { type: "stdout" } },
      categories: {
        default: { appenders: ["out"], level: "debug" },
      },
    });

    this.logger = log4js.getLogger();
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }
}
export const logger = new Logger();
