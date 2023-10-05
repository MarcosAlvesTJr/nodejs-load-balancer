import * as http from "node:http";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

function forward(request: http.IncomingMessage, response: http.ServerResponse) {
  if (!request.url) {
    response.statusCode = 400;
    response.end("No url provided");
    return;
  }
  const url = new URL(request.url, BACKEND_URL);
  const forwarded = http.request(
    url,
    {
      method: request.method,
      headers: request.headers,
    },
    (backendResponse) => {
      backendResponse.on("data", (chunk) => {
        console.log("Data is coming from backend");
        response.write(chunk);
      });
      backendResponse.on("end", () => {
        console.log("Backend response ended");
        response.end();
      });
    },
  );
  console.log("Request is being forwarded to backend");
  forwarded.end();
}

function serverListener(
  request: http.IncomingMessage,
  response: http.ServerResponse,
) {
  forward(request, response);
}

const server = http.createServer(serverListener);

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
