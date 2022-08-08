"use strict";

import * as Hapi from "@hapi/hapi";
import CatboxRedis from "@hapi/catbox-redis";
import "dotenv/config";
import dealRoutes from "./routes/deals";
import uprightInternalGet from "./methods/upright-internal-get";

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "0.0.0.0",
  cache: [
    {
      name: "redis",
      provider: {
        constructor: CatboxRedis,
        options: {
          host: "0.0.0.0",
          port: 6379,
          db: 0,
        },
      },
    },
  ],
});

// Register plugins
const registerPlugins = async () => {
  // Routes
  await server.register([dealRoutes]);
  // Server methods
  await server.register([uprightInternalGet]);
};

server.route({
  method: "GET",
  path: "/",
  handler: (_request, _h) => {
    return "Hello World2";
  },
});

// Just for testing purposes
// TODO: Remove before deploying to production!
server.route({
  method: "GET",
  path: "/companies/name/{name}",
  handler: (request: Hapi.Request) => {
    return server.methods.uprightInternalGet(
      "search",
      `types=[%22company%22]&query=${encodeURIComponent(request.params.name)}`
    );
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
