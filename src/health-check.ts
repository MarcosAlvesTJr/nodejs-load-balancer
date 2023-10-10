import { request } from "node:http";
import { logger } from "./logger";

export class HealthCheck {
  constructor(
    private readonly server: string,
    private readonly urlList: string[],
  ) {}

  public check() {
    let isHealthy = false;
    request(this.server, (response) => {
      logger.debug(`Checking ${this.server} health status`);
      logger.debug(`Response status code: ${response.statusCode}`);
      isHealthy = response.statusCode === 200;
      if (isHealthy && !this.urlList.includes(this.server)) {
        logger.debug(`${this.server} is healthy`);
        this.urlList.push(this.server);
        logger.debug(`Adding ${this.server} to the list of servers to check`);
      }
    })
      .on("error", () => {
        isHealthy = false;
        logger.debug(
          `Removing ${this.server} from the list of servers to check`,
        );
        this.urlList.splice(this.urlList.indexOf(this.server), 1);
      })
      .on("end", () => {
        if (!isHealthy) {
          logger.debug(
            `Removing ${this.server} from the list of servers to check`,
          );
          this.urlList.splice(this.urlList.indexOf(this.server), 1);
        }
      })
      .end();
    return this.urlList;
  }
}
