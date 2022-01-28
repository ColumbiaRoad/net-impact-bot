import Joi from "joi";

const envSchema = Joi.object({
  hsAccessToken: Joi.string().required(),
  uprightApiToken: Joi.string().required(),
  slackToken: Joi.string().required(),
  slackChannel: Joi.string().required(),
});

const env = {
  hsAccessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  uprightApiToken: process.env.UPRIGHT_API_TOKEN,
  slackToken: process.env.SLACK_TOKEN,
  slackChannel: process.env.SLACK_CHANNEL,
};

envSchema.validate(env);

export default {
  ...env,
  hsApiRoot: "https://api.hubapi.com",
  uprightApiRoot: "https://api.uprightproject.com/v1",
};
