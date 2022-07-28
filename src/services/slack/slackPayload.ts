import { ActionsBlock, KnownBlock } from "@slack/web-api";
import { UprightProfile } from "../../../types";

export function getSlackPayload(company: string, profiles: UprightProfile[]) {
  let message: string;
  profiles.length > 1
    ? (message = `Hello! Could you please help me figure out which of the following company profiles matches the ${company} deal that was recently posted in the #sales channel?`)
    : (message = `Hello! Could you please confirm if the following company profile matches the ${company} deal that was recently posted in the #sales channel?`);

  const blocks: Array<KnownBlock> = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message,
      },
    },
  ];

  profiles.map((profile) => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${profile.name}:* ${profile.description}`,
      },
    });
  });

  const buttons: ActionsBlock = {
    type: "actions",
    elements: [],
  };

  if (profiles.length > 1) {
    profiles.find((profile) => {
      buttons.elements?.push({
        type: "button",
        text: {
          type: "plain_text",
          text: `${profile.name}`,
          emoji: true,
        },
        value: `${profile.id}`,
      });
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
