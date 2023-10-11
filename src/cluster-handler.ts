import cluster from "node:cluster";
import process from "node:process";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { availableParallelism } from "node:os";
import { logger } from "./logger";
import { HealthCheck } from "./health-check";
import { WorkerMessage } from "./worker-message";

const numCPUs = availableParallelism();

type ServerListener = (
  request: IncomingMessage,
  response: ServerResponse,
) => void;

export class Cluster {
  private workers: ReturnType<typeof cluster.fork>[] = [];

  constructor(
    private readonly serverListener: ServerListener,
    private readonly healthCheck: HealthCheck,
  ) {}

  private sendMessageToWorkers(message: WorkerMessage) {
    if (cluster.isPrimary) {
      this.workers.forEach((worker) => {
        worker.send(message);
      });
    }
  }

  start() {
    if (cluster.isPrimary) {
      for (let i = 0; i < numCPUs; i++) {
        this.workers.push(cluster.fork());
      }
      cluster.on("exit", () => {
        cluster.fork();
      });
      this.healthCheck.init((healthyBackends) =>
        this.sendMessageToWorkers({
          message: "health-check",
          payload: healthyBackends,
        }),
      );
    } else {
      const server = createServer(this.serverListener);
      server.listen(3000, () => {
        logger.debug(`[${process.pid}] - Server listening on port 3000`);
      });
    }
  }
}
