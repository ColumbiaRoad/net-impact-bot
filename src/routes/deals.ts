"use strict";

import Hapi from "@hapi/hapi";
import getDeals from "../services/deal";

const deals = {
  name: "routes/deals",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "GET",
      path: "/deals",
      handler: getDeals,
    });
  },
};

export default deals;
