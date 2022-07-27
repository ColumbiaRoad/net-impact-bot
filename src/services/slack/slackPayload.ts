import { ActionsBlock, KnownBlock } from "@slack/web-api";
import { UprightProfile } from "../../../types";

export function getSlackPayload(company: string, profiles: UprightProfile[]) {
  const blocks: Array<KnownBlock> = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hello! Could you please help me figure out which of the following company profiles matches the ${company} deal that was recently posted in the #sales channel?`,
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

  profiles.find((profile) => {
    buttons.elements?.push({
      type: "button",
      text: {
        type: "plain_text",
        text: `${profile.name}`,
        emoji: true,
      },
      value: `click_me: ${profile.name}`,
    });
  });

  blocks.push(buttons);

  return blocks;
}
