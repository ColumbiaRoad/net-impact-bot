import { KnownBlock } from "@slack/web-api";
import { Company } from "../../../types";
import config from "../../config";

export function getUpdatedSlackPayload(matchFound: boolean, company: Company) {
  let blocks: Array<KnownBlock>;

  if (matchFound) {
    const URlink = `${config.uprightPlatformRoot}/company/${company.upright_id}`;
    const HSlink = `${config.hsUrlRoot}/contacts/${config.hsPortalId}/company/${company.objectId}/properties`;
    blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*<" +
            `${URlink}` +
            "|This profile> was added to " +
            `${company.name}` +
            " on Hubspot*.",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Does it seem incorrect? You can manually update the Upright ID on HubSpot <" +
            `${HSlink}` +
            "|here>.",
        },
      },
    ];
  } else {
    blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Let's hope that a profile will be created in Upright in the near future.",
        },
      },
    ];
  }
  return blocks;
}
