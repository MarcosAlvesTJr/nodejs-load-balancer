import { IncomingMessage, ServerResponse, request } from "node:http";

export class HttpForwardHandler {
  private readonly BACKEND_URL =
    process.env.BACKEND_URL || "http://localhost:8080";

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
      serverResponse.end();
    });
    incomingMessage.on("error", (error) => {
      serverResponse.end();
    });
  }

  public handle(serverRequest: IncomingMessage, response: ServerResponse) {
    this.validateIncomingURL(serverRequest.url);
    const url = new URL(serverRequest.url, this.BACKEND_URL);
    const options = {
      method: serverRequest.method,
      headers: serverRequest.headers,
    };
    const forwarded = request(url, options, (backendResponse) =>
      this.handleServerIncomingMessage(backendResponse, response),
    );
    forwarded.on("error", (error) => {
      response.end();
    });
    forwarded.end();
  }
}
