### Node.js Load Balancer

This is a simple load balancer written in Node.js. It leverages cluster module to fork multiple processes
that spin up a http server and share the same port. The load balancer uses a round-robin algorithm to
distribute the incoming requests to a different server each time within each process. It also performs periodic
health checks to make sure that the servers are still alive, this is done using inter process communication - the primary
process is responsible for sending the health check requests and messaging the child processes with an updated list of
servers.

### How to run

In order to run the load balancer execute the following script listed in the package.json file:

```bun run dev```

In order to run the test servers execute the following script listed in the package.json file:

```bun run servers```

By default, the load balancer will run on port 3000 and the test servers will run on ports 8080, 8081, 8082.

### How to change or add servers

In order to change the servers, you can modify the constants.ts file. The file contains an array of servers
that the load balancer will distribute the incoming requests to.

#### Disclaimer

This is a simple load balancer that is not production ready. It is meant to be used for educational purposes only.
