"use strict";

import { ServerMethod } from "@hapi/hapi";
import { PolicyOptions } from "@hapi/catbox";

/*
  For some reason, @types/hapi__catbox is missing the property `cache` from
  `ServerMethodCache` so this needs to be added manually. Create a PR if
  you know a more elegant solution.
*/
interface CustomServerMethodCache extends PolicyOptions<unknown> {
  generateTimeout: number | false;
  cache?: string;
}
interface CustomServerMethodOptions {
  cache?: CustomServerMethodCache | undefined;
}
interface CustomServer {
  method(
    name: string,
    method: ServerMethod,
    options?: CustomServerMethodOptions
  ): void;
}

const exampleFunc = () => {
  return new Date();
};

const example = {
  name: "methods/example",
  register: function (server: CustomServer) {
    server.method("example", exampleFunc, {
      cache: {
        cache: "redis",
        expiresIn: 10 * 1000, // 10 s
        generateTimeout: 2000,
      },
    });
  },
};

export default example;
