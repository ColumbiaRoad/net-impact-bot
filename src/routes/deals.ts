"use strict";

import Hapi from "@hapi/hapi";
import Joi from "joi";
import { updateUid } from "../services/hubspot/company";
import {
  handleGetUprightProfile,
  handleGetUprightProfileURL,
  handlePostDeal,
} from "../controllers/deal";
import handlePostCompany from "../controllers/company";

const deals = {
  name: "routes/deals",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "POST",
      path: "/deals",
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

    //to do: route for /webhook/hubspot/companies
    // check if UID exists

    server.route({
      method: "POST",
      path: "/webhook/hubspot/companies",
      handler: handlePostCompany,
      options: {
        validate: {
          payload: Joi.object({
            objectType: Joi.string().required(),
            objectId: Joi.string().required(),
          }),
          options: {
            allowUnknown: true,
          },
        },
      },
    });

    server.route({
      method: "POST",
      path: "/webhook/slack/interactions",
      handler: updateUid,
      options: {
        validate: {
          payload: Joi.object({
            actions: Joi.array().required().items({
              value: Joi.string().required(),
            }),
          }),
          options: {
            allowUnknown: true,
          },
        },
      },
    });

    server.route({
      method: "GET",
      path: "/deals/{id}/profile",
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
      path: "/deals/{id}/profileURL",
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
