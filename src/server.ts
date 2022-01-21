"use strict";

import * as Hapi from "@hapi/hapi";
import dealRoutes from "./routes/deals";

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "0.0.0.0",
});

// Register plugins
const registerPlugins = async () => {
  // Routes
  await server.register([dealRoutes]);
};

server.route({
  method: "GET",
  path: "/",
  handler: (_request, _h) => {
    return "Hello World2";
  },
});

const init = async () => {
  await registerPlugins();
  await server.initialize();
  return server;
};

const start = async () => {
  await registerPlugins();
  await server.start();
  console.log("Server running on %s", server.info.uri);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

export { init, start };
