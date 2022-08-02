"use strict";

import Hapi from "@hapi/hapi";

const exampleFunc = () => {
  return new Date();
};

const example = {
  name: "methods/example",
  register: function (server: Hapi.Server) {
    server.method("example", exampleFunc, {
      cache: {
        expiresIn: 10000,
        generateTimeout: 2000,
      },
    });
  },
};

export default example;
