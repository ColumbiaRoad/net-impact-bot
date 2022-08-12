import { postInteractivePrompt } from "../slack/slack";
import { getSlackPayload } from "../slack/slackPayload";
import { sendError } from "../../controllers/deal";
import { search } from "../upright/search";
import { UprightProfile } from "../../../types";
import config from "../../config";

async function interactiveSlackBot(company: string, companyID: string, token: string, modelVersion: string) {
  const keywords = company.trim().split(/\s+/);

  const profile = await search(token, modelVersion, company);
  const matches: UprightProfile[] = [];
  keywords.forEach((keyword) => {
    const results: UprightProfile[] | undefined = profile?.filter(
      (item) => item.name.toUpperCase() === keyword.toUpperCase()
    );
    results?.map((r) => matches.push(r));
  });
  if (matches.length < 1) {
    await sendError(
      `Sorry, a match for ${company} was not found on Upright :confused:`,
      true
    );
    return null;
  }
  const payload = getSlackPayload(company,companyID, matches);
  const posted = postInteractivePrompt(company, config.slackChannel, payload);
  if (!posted) {
    sendError(
      `Something went wrong - could not post the interactive bot to channel with ID ${config.slackChannel}`,
      false
    );
  }

  //TODO: TRIGGER THE ENDPOINT THAT ADDS THE UID OF THE SELECTED BUTTON TO HUBSPOT

  return "ok";
}

export { interactiveSlackBot };