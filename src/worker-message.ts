export interface WorkerMessage {
  payload: unknown | unknown[];
  message: "health-check";
}
