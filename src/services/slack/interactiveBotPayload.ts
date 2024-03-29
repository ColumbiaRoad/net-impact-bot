import {
  Confirm,
  DividerBlock,
  KnownBlock,
  SectionBlock,
} from "@slack/web-api";
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

const confirmNoMatch = (companyName?: string) => {
  const confirmation: Confirm = {
    title: {
      type: "plain_text",
      text: "Are you sure?",
    },
    text: {
      type: "plain_text",
      text: `${companyName || "There"} is not a match?`,
    },
    confirm: {
      type: "plain_text",
      text: "Confirm",
    },
  };
  return confirmation;
};

export function getSlackPayload(
  companyName: string,
  companyID: string,
  profiles: UprightProfile[]
) {
  if (profiles.length < 1) throw new Error("No profiles provided");

  const isSingleResult = profiles.length === 1;

  const blocks: Array<KnownBlock> = [
    // Header
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
        text: isSingleResult
          ? `Does the following profile match *${companyName}* on Hubspot?`
          : `Which of the following profiles matches *${companyName}* on Hubspot?`,
      },
    },
    {
      type: "divider",
    },

    // Search results
    ...profiles.flatMap((profile): (SectionBlock | DividerBlock)[] => {
      const URlink = `${config.uprightPlatformRoot}/company/${profile.id}`;
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*<${URlink}|${profile.name}>*: ${truncate(
              profile.description?.replace(/[\r\n]/gm, ""),
              250
            )}`,
          },
          ...(isSingleResult
            ? // For a single result, no button is attached. See Actions instead.
              {}
            : // For multiple results, attach a selection button to each.
              {
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
              }),
        },
        {
          type: "divider",
        },
      ];
    }),

    // Actions
    {
      type: "actions",
      elements: isSingleResult
        ? // For a single result, show the selection buttons ("yes/no") for the result
          [
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
            },
          ]
        : // For multiple results, show the negative selection button ("none of the above")
          [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "None of these :confused:",
                emoji: true,
              },
              value: valueString("no_match_found", companyID),
              confirm: confirmNoMatch(),
            },
          ],
    },
  ];

  return blocks;
}
