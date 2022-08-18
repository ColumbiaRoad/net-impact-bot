import { postErrorMessage, postInteractivePrompt } from "../slack/slack";
import { getSlackPayload } from "../slack/slackPayload";
import { sendError } from "../../controllers/deal";
import { search } from "../upright/search";
import { UprightProfile } from "../../../types";
import config from "../../config";
import Hapi from "@hapi/hapi";

async function interactiveSlackBot(
  company: string,
  companyID: string,
  server: Hapi.Server
) {
  const results = await search(server, company);
  if (!results) {
    postErrorMessage(`no search results found on Upright for ${company}`);
    throw new Error(`no search results found on Upright for ${company}`);
  }
  const matches: UprightProfile[] = [];
  const directMatch: UprightProfile | undefined = results.find(
    (item) => item.name.toUpperCase() === company.toUpperCase()
  );
  if (directMatch) {
    matches.push(directMatch);
  } else {
    const keywords = company.trim().split(/\s+/);
    const filtered: UprightProfile[] = results.filter((item) =>
      item.name.toUpperCase().includes(keywords[0].toUpperCase())
    );
    filtered.map((result) => matches.push(result));
  }
  if (matches.length < 1) {
    await sendError(
      `Sorry, a match for ${company} was not found on Upright`,
      true
    );
  }
  const payload = getSlackPayload(company, companyID, matches);
  const posted = postInteractivePrompt(company, config.slackChannel, payload);
  if (!posted) {
    sendError(
      `Something went wrong - could not post the interactive bot to channel with ID ${config.slackChannel}`,
      false
    );
  }

  //TODO: TRIGGER THE ENDPOINT THAT ADDS THE UID OF THE SELECTED BUTTON TO HUBSPOT
}

export { interactiveSlackBot };
