import { IncomingMessage, ServerResponse } from "node:http";
import { HttpForwardHandler } from "./http-forward-handler";
import { Cluster } from "./cluster-handler";

const httpForwardHandler = new HttpForwardHandler();

function serverListener(request: IncomingMessage, response: ServerResponse) {
  httpForwardHandler.handle(request, response);
}

Cluster.create(serverListener);
