import * as http from "node:http";

export const server8080 = http.createServer((req, res) => {
  req.on("error", (err) => console.error(err));
  res.on("error", (err) => console.error(err));
  console.log("Server 8080 received a request!");
  let sum = 0;
  for (let i = 0; i < 1e7; i++) {
    sum += i;
  }
  res.end("Hello World!");
});
server8080.on("error", (err) => console.error(err));
