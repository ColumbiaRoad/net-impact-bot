import { ActionsBlock, Button, SectionBlock } from "@slack/web-api";
import { UprightProfile } from "../../../types";

export function getSlackPayload(company: string, profiles: UprightProfile[]) {
  const payload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hello! Could you please help me figure out which of the following company profiles matches the ${company} deal that was recently posted in the #sales channel?`,
        },
      },
    ] as Array<ActionsBlock | SectionBlock>,
  };

  profiles.map((profile) => {
    payload.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${profile.name}:* ${profile.description}`,
      },
    } as SectionBlock);
  });

  const buttons: ActionsBlock = {
    type: "actions",
    elements: [] as Button[],
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

  payload.blocks.push(buttons);

  return payload;
}
