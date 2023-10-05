import cluster from "node:cluster";
import process from "node:process";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { availableParallelism } from "node:os";

const numCPUs = availableParallelism();

type ServerListener = (
  request: IncomingMessage,
  response: ServerResponse,
) => void;

export class Cluster {
  static create(serverListener: ServerListener) {
    if (cluster.isPrimary) {
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on("exit", () => {
        cluster.fork();
      });
    } else {
      const server = createServer(serverListener);
      server.listen(3000, () => {
        console.log(`[${process.pid}] - Server listening on port 3000`);
      });
    }
  }
}
