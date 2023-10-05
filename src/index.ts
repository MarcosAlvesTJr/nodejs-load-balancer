import * as http from "node:http";
import { HttpForwardHandler } from "./http-forward-handler";

const httpForwardHandler = new HttpForwardHandler();

function serverListener(
  request: http.IncomingMessage,
  response: http.ServerResponse,
) {
  httpForwardHandler.handle(request, response);
}

const server = http.createServer(serverListener);

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
