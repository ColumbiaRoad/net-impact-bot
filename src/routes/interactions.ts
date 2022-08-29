"use strict";

import Hapi from "@hapi/hapi";
import Joi from "joi";
import { handleUpdateUid } from "../controllers/company";

const interactions = {
  name: "routes/interactions",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "POST",
      path: "/webhook/slack/interactions",
      handler: handleUpdateUid,
      options: {
        validate: {
          payload: Joi.object({
            payload: Joi.string().required(),
          }),
          options: {
            allowUnknown: true,
          },
        },
      },
    });
  },
};

export default interactions;
