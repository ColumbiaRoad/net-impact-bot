"use strict";

import Hapi from "@hapi/hapi";
import Joi from "joi";
import { handlePostCompany } from "../controllers/company";
import config from "../config";

const companies = {
  name: "routes/companies",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "POST",
      path: `/webhook/hubspot/companies/${config.hsHash}`,
      handler: handlePostCompany,
      options: {
        validate: {
          payload: Joi.object({
            objectType: Joi.string().pattern(/^COMPANY$/),
            objectId: Joi.number().integer().required(),
          }),
          options: {
            allowUnknown: true,
          },
        },
      },
    });
  },
};

export default companies;
