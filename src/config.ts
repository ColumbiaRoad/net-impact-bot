import Joi from "joi";

const envSchema = Joi.object({
  hsAccessToken: Joi.string().required(),
  hsApiKey: Joi.string().required(),
  uprightApiToken: Joi.string().required(),
  slackToken: Joi.string().required(),
  slackChannel: Joi.string().required(),
  slackErrorChannel: Joi.string(),
  slackSigningSecret: Joi.string(),
});

const env = {
  hsAccessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  hsApiKey: process.env.HUBSPOT_API_KEY,
  uprightApiToken: process.env.UPRIGHT_API_TOKEN,
  uprightLogin: process.env.UPRIGHT_LOGIN,
  uprightPW: process.env.UPRIGHT_PW,
  slackToken: process.env.SLACK_TOKEN,
  slackChannel: process.env.SLACK_CHANNEL || "",
  slackErrorChannel: process.env.SLACK_ERROR_CHANNEL || null,
};

envSchema.validate(env);

export default {
  ...env,
  hsApiRoot: "https://api.hubapi.com",
  uprightApiRoot: "https://api.uprightproject.com/v1",
  uprightInternalApiRoot: "https://uprightplatform.com/api",
};
