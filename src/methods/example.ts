"use strict";

import Hapi from "@hapi/hapi";
import { Policy } from "@hapi/catbox";

async function exampleFunc(
  this: Policy<unknown, { cache: string; expiresIn: number }>
) {
  const date = await this.get("date");
  if (!date) {
    const newDate = new Date();
    await this.set("date", newDate);
    return newDate;
  }
  return date;
}

const example = {
  name: "methods/example",
  register: function (server: Hapi.Server) {
    const exampleCache = server.cache({
      cache: "redis",
      expiresIn: 10 * 1000,
    });
    server.method("example", exampleFunc, {
      bind: exampleCache,
    });
  },
};

export default example;
