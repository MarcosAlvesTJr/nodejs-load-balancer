import { get } from "node:http";
import { logger } from "./logger";
import { BACKEND_URL_LIST } from "./constants";

type HealthCheckListener = (healthyBackends: string[]) => void;

export class HealthCheck {
  constructor(private healthyBackends: string[] = [...BACKEND_URL_LIST]) {}

  private async check(url: string): Promise<boolean> {
    return await new Promise((resolve) => {
      const request = get(url, (response) => {
        resolve(response.statusCode === 200);
      });
      request.on("error", () => {
        resolve(false);
      });
      request.end();
    });
  }

  private removeBackend(backend: string) {
    const index = this.healthyBackends.indexOf(backend);
    if (index > -1) {
      this.healthyBackends.splice(index, 1);
    }
  }

  private addBackend(backend: string) {
    if (!this.healthyBackends.includes(backend)) {
      this.healthyBackends.push(backend);
    }
  }

  public init(listener: HealthCheckListener) {
    setInterval(async () => {
      for (const backend of BACKEND_URL_LIST) {
        const isHealthy = await this.check(backend);
        if (isHealthy) {
          this.addBackend(backend);
        } else {
          this.removeBackend(backend);
        }
      }
      logger.debug(`Healthy backends: ${this.healthyBackends.join(", ")}`);
      listener(this.healthyBackends);
    }, 10000);
  }
}
