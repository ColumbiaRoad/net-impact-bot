"use strict";

import Hapi from "@hapi/hapi";
import Joi from "joi";
import {
  handleGetUprightProfile,
  handleGetUprightProfileURL,
  handlePostDeal,
} from "../controllers/deal";
import config from "../config";

const deals = {
  name: "routes/deals",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "POST",
      path: `/webhooks/hubspot/deals/${config.dealsHash}`,
      handler: handlePostDeal,
      options: {
        validate: {
          payload: Joi.object({
            objectId: Joi.number().integer().required(),
          }),
          options: {
            allowUnknown: true,
          },
        },
      },
    });

    server.route({
      method: "GET",
      path: `/deals/{id}/profile/${config.dealsHash}`,
      handler: handleGetUprightProfile,
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().required(),
          }),
        },
      },
    });

    server.route({
      method: "GET",
      path: `/deals/{id}/profileURL/${config.dealsHash}`,
      handler: handleGetUprightProfileURL,
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().required(),
          }),
        },
      },
    });
  },
};

export default deals;
