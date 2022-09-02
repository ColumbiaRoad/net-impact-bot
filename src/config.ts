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
  botAdmin: Joi.string().required(),
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
  botAdmin: process.env.BOT_ADMIN,
};

envSchema.validate(env);

export default {
  ...env,
  hsApiRoot: "https://api.hubapi.com",
  hsUrlRoot: "https://app.hubspot.com",
  slackFileUrlroot: "https://files.slack.com/files-pri",
  uprightPlatformRoot: "uprightplatform.com", //REMOVING "HTTPS" REMOVES LINK PREVIEW IN SLACK MESSAGES
  uprightApiRoot: "https://api.uprightproject.com/v1",
  uprightInternalApiRoot: "https://uprightplatform.com/api",
};
