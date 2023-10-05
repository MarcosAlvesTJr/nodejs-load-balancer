import * as http from "node:http";

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
    incomingMessage: http.IncomingMessage,
    serverResponse: http.ServerResponse,
  ) {
    incomingMessage.on("data", (chunk) => {
      serverResponse.write(chunk);
    });
    incomingMessage.on("end", () => {
      serverResponse.end();
    });
  }

  public handle(request: http.IncomingMessage, response: http.ServerResponse) {
    this.validateIncomingURL(request.url);
    const url = new URL(request.url, this.BACKEND_URL);
    const options = {
      method: request.method,
      headers: request.headers,
    };
    const forwarded = http.request(url, options, (backendResponse) =>
      this.handleServerIncomingMessage(backendResponse, response),
    );
    forwarded.end();
  }
}
