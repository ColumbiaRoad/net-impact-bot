"use strict";

import * as Hapi from "@hapi/hapi";

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});

server.route({
  method: "GET",
  path: "/",
  handler: (_request, _h) => {
    return "Hello World!";
  },
});

const init = async () => {
  await server.initialize();
  return server;
};

const start = async () => {
  await server.start();
  console.log("Server running on %s", server.info.uri);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

export { init, start };
