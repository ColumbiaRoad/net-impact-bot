import { KnownBlock } from "@slack/web-api";

export function getUpdatedSlackPayload(
  company: string,
  HSlink: string,
  URlink: string | null
) {
  const blocks: Array<KnownBlock> = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*<" +
          `${URlink}` +
          "|This profile> was added to " +
          `${company}` +
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
  return blocks;
}
