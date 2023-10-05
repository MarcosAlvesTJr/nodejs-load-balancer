import { IncomingMessage, ServerResponse, request } from "node:http";
import { BACKEND_URL_LIST } from "./constants";
import { logger } from "./logger";

export class HttpForwardHandler {
  private lastUsedServerIndex = 0;

  constructor() {}

  private validateIncomingURL(url: string | undefined): asserts url is string {
    if (!url) {
      throw new Error("No url provided");
    }
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
