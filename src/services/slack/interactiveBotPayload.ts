import { ActionsBlock, Confirm, KnownBlock } from "@slack/web-api";
import { UprightProfile } from "../../../types";
import config from "../../config";
import { truncate } from "./utils";

const valueString = (uprightId: string, hsId: string) => {
  return `${uprightId}/${hsId}`;
};

const confirmMatch = (companyName: string) => {
  const confirmation: Confirm = {
    title: {
      type: "plain_text",
      text: "Are you sure?",
    },
    text: {
      type: "plain_text",
      text: `Is ${companyName} a match?`,
    },
    confirm: {
      type: "plain_text",
      text: "Yep, it's a match!",
    },
    deny: {
      type: "plain_text",
      text: "Nope! I'll pick another!",
    },
  };
  return confirmation;
};

const confirmNoMatch = (companyName: string | null) => {
  const confirmation: Confirm = {
    title: {
      type: "plain_text",
      text: "Are you sure?",
    },
    text: {
      type: "plain_text",
      text: `${companyName ? companyName : "There"} is not a match?`,
    },
    confirm: {
      type: "plain_text",
      text: "Confirm",
    },
  };
  return confirmation;
};

export function getSlackPayload(
  company: string,
  companyID: string,
  profiles: UprightProfile[]
) {
  const message: string =
    profiles.length > 1
      ? `Which of the following profiles matches *${company}* on Hubspot?`
      : `Does the following profile match *${company}* on Hubspot?`;
  const blocks: Array<KnownBlock> = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Hello! Could you help me? :pray:",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message,
      },
    },
    {
      type: "divider",
    },
  ];

  const buttons: ActionsBlock = {
    type: "actions",
    elements: [],
  };

  if (profiles.length > 1) {
    profiles.map((profile) => {
      const URlink = `${config.uprightPlatformRoot}/company/${profile.id}`;
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*<${URlink}|${profile.name}>*: ${truncate(
              profile.description?.replace(/[\r\n]/gm, ""),
              250
            )}`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: ":point_left: This one!",
              emoji: true,
            },
            value: valueString(profile.id, companyID),
            confirm: confirmMatch(profile.name),
          },
        },
        {
          type: "divider",
        }
      );
    });

    buttons.elements?.push({
      type: "button",
      text: {
        type: "plain_text",
        text: "None of these :confused:",
        emoji: true,
      },
      value: valueString("no_match_found", companyID),
      confirm: confirmNoMatch(null),
    });
  } else {
    blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${profiles[0].name}:* ${truncate(
            profiles[0].description?.replace(/[\r\n]/gm, ""),
            350
          )}`,
        },
      },
      {
        type: "divider",
      }
    );

    buttons.elements?.push(
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Yep, it's a match!",
          emoji: true,
        },
        value: valueString(profiles[0].id, companyID),
        confirm: confirmMatch(profiles[0].name),
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Nope, not a match!",
          emoji: true,
        },
        value: valueString("no_match_found", companyID),
        confirm: confirmNoMatch(profiles[0].name),
      }
    );
  }

  blocks.push(buttons);
  return blocks;
}
