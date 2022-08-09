"use strict";

import Hapi from "@hapi/hapi";
import Joi from "joi";
import { getDeals, postDeal } from "../services/deal";
import { updateUid } from "../services/hubspot/company";

const deals = {
  name: "routes/deals",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "GET",
      path: "/deals",
      handler: getDeals,
    });

    server.route({
      method: "POST",
      path: "/deals",
      handler: postDeal,
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
      method: "POST",
      path: "/webhook/hubspot/company",
      handler: updateUid,
      options: {
        validate: {
          payload: Joi.object({
            objectId: Joi.number().integer().required(),
          }),
          options: {
            allowUnknown: true,
          }
        }
      }
    });
    
  },
};

export default deals;
