import Joi from "joi";

const envSchema = Joi.object({
  hsAccessToken: Joi.string().required(),
  hsPortalId: Joi.number().required,
  uprightApiToken: Joi.string().required(),
  uprightUserEmail: Joi.string().required(),
  uprightUserPassword: Joi.string().required(),
  slackToken: Joi.string().required(),
  slackProfileChannel: Joi.string().required(),
  slackAdminChannel: Joi.string().required(),
});

const env = {
  hsAccessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  hsPortalId: process.env.HUBSPOT_PORTAL_ID,
  uprightApiToken: process.env.UPRIGHT_API_TOKEN,
  uprightUserEmail: process.env.UPRIGHT_USER_EMAIL,
  uprightUserPassword: process.env.UPRIGHT_USER_PASSWORD,
  slackToken: process.env.SLACK_TOKEN,
  slackProfileChannel: process.env.SLACK_PROFILE_CHANNEL,
  slackAdminChannel: process.env.SLACK_ADMIN_CHANNEL,
  slackHash: process.env.SLACK_HASH,
  hsHash: process.env.HUBSPOT_HASH,
  deals1Hash: process.env.DEALS_1_HASH,
  deals2Hash: process.env.DEALS_2_HASH,
  deals3Hash: process.env.DEALS_3_HASH,
};

envSchema.validate(env);

export default {
  ...env,
  hsApiRoot: "https://api.hubapi.com",
  hsUrlRoot: "https://app.hubspot.com",
  uprightPlatformRoot: "https://uprightplatform.com",
  uprightApiRoot: "https://api.uprightproject.com/v1",
  uprightInternalApiRoot: "https://uprightplatform.com/api",
};
