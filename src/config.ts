import Joi from "joi";

const envSchema = Joi.object({
  hsAccessToken: Joi.string().required(),
  hsPortalId: Joi.number().required,
  uprightApiToken: Joi.string().required(),
  uprightUserEmail: Joi.string().required(),
  uprightUserPassword: Joi.string().required(),
  slackToken: Joi.string().required(),
  slackChannel: Joi.string().required(),
  slackErrorChannel: Joi.string(),
});

const env = {
  hsAccessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  hsPortalId: process.env.HUBSPOT_PORTAL_ID,
  uprightApiToken: process.env.UPRIGHT_API_TOKEN,
  uprightUserEmail: process.env.UPRIGHT_USER_EMAIL,
  uprightUserPassword: process.env.UPRIGHT_USER_PASSWORD,
  slackToken: process.env.SLACK_TOKEN,
  slackChannel: process.env.SLACK_CHANNEL,
  slackErrorChannel: process.env.SLACK_ERROR_CHANNEL || null,
};

envSchema.validate(env);

export default {
  ...env,
  hsApiRoot: "https://api.hubapi.com",
  hsUrlRoot: "https://app.hubspot.com",
  uprightApiRoot: "https://api.uprightproject.com/v1",
  uprightInternalApiRoot: "https://uprightplatform.com/api",
};
