import { IncomingMessage, ServerResponse, request } from "node:http";
import { BACKEND_URL_LIST } from "./constants";
import { logger } from "./logger";
import { HealthCheck } from "./health-check";

export class HttpForwardHandler {
  private lastUsedServerIndex = 0;
  private urlList = [...BACKEND_URL_LIST];
  private HEALTH_CHECK_INTERVAL_IN_MS = 10000;

  constructor() {
    this.healthCheck();
  }

  private validateIncomingURL(url: string | undefined): asserts url is string {
    if (!url) {
      throw new Error("No url provided");
    }
  }

  private healthCheck() {
    let serversCheck: HealthCheck[] = [];
    for (const urlListElement of this.urlList) {
      serversCheck.push(new HealthCheck(urlListElement, BACKEND_URL_LIST));
    }
    setInterval(() => {
      serversCheck.forEach((serverCheck) => {
        this.urlList = serverCheck.check();
      });
    }, this.HEALTH_CHECK_INTERVAL_IN_MS);
  }

  private handleServerIncomingMessage(
    incomingMessage: IncomingMessage,
    serverResponse: ServerResponse,
  ) {
    incomingMessage.on("data", (chunk) => {
      serverResponse.write(chunk);
    });
    incomingMessage.on("end", () => {
      logger.debug(`Response ended`);
      serverResponse.end();
    });
    incomingMessage.on("error", () => {
      serverResponse.end();
    });
  }

  get serverURL(): string {
    const serversAvailable = BACKEND_URL_LIST.length;
    if (serversAvailable > 1) {
      this.lastUsedServerIndex =
        (this.lastUsedServerIndex + 1) % serversAvailable;
      return BACKEND_URL_LIST[this.lastUsedServerIndex];
    }
    return BACKEND_URL_LIST[0];
  }

  public handle(serverRequest: IncomingMessage, response: ServerResponse) {
    this.validateIncomingURL(serverRequest.url);
    const url = new URL(serverRequest.url, this.serverURL);
    const options = {
      method: serverRequest.method,
      headers: serverRequest.headers,
    };
    logger.debug(`Forwarding request to ${url}`);
    logger.debug(`Forwarding request with options ${JSON.stringify(options)}`);
    const forwarded = request(url, options, (backendResponse) =>
      this.handleServerIncomingMessage(backendResponse, response),
    );
    forwarded.on("error", () => {
      response.end();
    });
    forwarded.end();
  }
}
