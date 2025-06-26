/* eslint-env node */
import { config } from "dotenv";
import fs from "fs";

// Load .env variables into process.env
config();

const envVars = {
  HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN,
  HUBSPOT_PORTAL_ID: process.env.HUBSPOT_PORTAL_ID,
  UPRIGHT_API_TOKEN: process.env.UPRIGHT_API_TOKEN,
  UPRIGHT_USER_EMAIL: process.env.UPRIGHT_USER_EMAIL,
  UPRIGHT_USER_PASSWORD: process.env.UPRIGHT_USER_PASSWORD,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  SLACK_PROFILE_CHANNEL: process.env.SLACK_PROFILE_CHANNEL,
  SLACK_ADMIN_CHANNEL: process.env.SLACK_ADMIN_CHANNEL,
  SLACK_HASH: process.env.SLACK_HASH,
  HUBSPOT_HASH: process.env.HUBSPOT_HASH,
  DEALS_HASH: process.env.DEALS_HASH,
  PORT: process.env.PORT,
  USE_AWS_LAMBDA: process.env.USE_AWS_LAMBDA,
  AWS_REGION: process.env.AWS_REGION,
};

// Create the env.json file format SAM expects
const envJson = {
  NetImpactBotApiFunction: envVars,
};

// Write to env.json
fs.writeFileSync("env.json", JSON.stringify(envJson, null, 2));

console.log("env.json generated successfully based on .env file.");
