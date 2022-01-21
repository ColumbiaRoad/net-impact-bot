import Joi from "joi";

const envSchema = Joi.object({
  hsApiKey: Joi.string().required(),
});

const env = {
  hsApiKey: process.env.HUBSPOT_API_KEY,
};

envSchema.validate(env);

export default {
  ...env,
  hsApiRoot: "https://api.hubapi.com",
};
