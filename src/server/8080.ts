import * as http from "node:http";

export const server8080 = http.createServer((req, res) => {
  console.log("req.url", req.url);
  console.log("req.method", req.method);
  console.log("req.headers", req.headers);
  res.end("Hello World!");
});
