import { IncomingMessage, ServerResponse } from "node:http";
import { HttpForwardHandler } from "./http-forward-handler";
import { Cluster } from "./cluster-handler";
import { HealthCheck } from "./health-check";

const httpForwardHandler = new HttpForwardHandler();
const healthChecker = new HealthCheck();

function serverListener(request: IncomingMessage, response: ServerResponse) {
  httpForwardHandler.handle(request, response);
}

const cluster = new Cluster(serverListener, healthChecker);
cluster.start();
