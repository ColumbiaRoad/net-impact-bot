import { ActionsBlock, KnownBlock } from "@slack/web-api";
import { UprightProfile } from "../../../types";

export function getSlackPayload(company: string, profiles: UprightProfile[]) {
  let message: string;
  profiles.length > 1
    ? (message = ` Which of the following profiles matches the *${company}* deal that was recently posted in the #sales channel?`)
    : (message = `Does the following profile match the *${company}* deal that was recently posted in the #sales channel?`);

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
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${profile.name}:* ${truncate(
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
            value: `${profile.id}`,
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
        text: `None of these :confused:`,
        emoji: true,
      },
      value: `no_match_found`,
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
          text: `Yep, it's a match!`,
          emoji: true,
        },
        value: `${profiles[0].id}`,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: `Nope, not a match!`,
          emoji: true,
        },
        value: `no_match_found`,
      }
    );
  }

  blocks.push(buttons);
  return blocks;
}

function truncate(str: string | undefined, len: number) {
  if (str === undefined) {
    return "No description found for Upright profile.";
  } else if (str && str.length > len) {
    return str.substring(0, len) + "...";
  } else {
    return str;
  }
}
