import { server8080 } from "./8080";
import { server8081 } from "./8081";
import { server8082 } from "./8082";

server8080.listen(8080, () => {
  console.log("Server listening on port 8080");
});
server8081.listen(8081, () => {
  console.log("Server listening on port 8081");
});
server8082.listen(8082, () => {
  console.log("Server listening on port 8082");
});
