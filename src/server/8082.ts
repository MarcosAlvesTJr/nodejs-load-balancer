import * as http from "node:http";

export const server8082 = http.createServer((req, res) => {
  req.on("error", (err) => console.error(err));
  res.on("error", (err) => console.error(err));
  console.log("Server 8082 received a request!");
  res.statusCode = 200;
  res.end("Hello World!");
});
server8082.on("error", (err) => console.error(err));
server8082.listen(8082, () => console.log("Server 8082 is listening!"));
