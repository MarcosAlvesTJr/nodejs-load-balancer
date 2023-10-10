import * as http from "node:http";

export const server8081 = http.createServer((req, res) => {
  req.on("error", (err) => console.error(err));
  res.on("error", (err) => console.error(err));
  console.log("Server 8081 received a request!");
  res.statusCode = 200;
  res.end("Hello World!");
});
server8081.on("error", (err) => console.error(err));
server8081.listen(8081, () => console.log("Server 8081 is listening!"));
