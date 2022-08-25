import { postInteractivePrompt } from "../slack/slack";
import { getSlackPayload } from "../slack/slackPayload";
import { sendError } from "../../controllers/deal";
import { filterCompanies } from "../upright/search";
import config from "../../config";
import Hapi from "@hapi/hapi";

async function interactiveSlackBot(
  company: string,
  companyID: string,
  server: Hapi.Server
) {
  const matches = await filterCompanies(server, company);
  const payload = getSlackPayload(company, companyID, matches);
  const posted = postInteractivePrompt(company, config.slackChannel, payload);
  if (!posted) {
    sendError(
      `Something went wrong - could not post the interactive bot to channel with ID ${config.slackChannel}`,
      false
    );
  }
}

export { interactiveSlackBot };
