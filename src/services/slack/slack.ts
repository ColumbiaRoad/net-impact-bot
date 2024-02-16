import { KnownBlock, WebClient } from "@slack/web-api";
import config from "../../config";
import { getCompany } from "../hubspot/company";
import { getUpdatedSlackPayload } from "./interactiveUpdatedPayload";
import { slugify } from "voca";

const web = new WebClient(config.slackToken);

const uploadImage = async (
  img: Buffer,
  companyName: string,
  uprightId: string | null
) => {
  const link = uprightId
    ? `<https://uprightplatform.com/company/${uprightId}|${slugify(
        companyName
      )}>`
    : companyName;
  const message = `The Net Impact Profile for ${link} as a company. What is the impact of our work with them? See thread.`;
  try {
    await web.files.upload({
      channels: config.slackProfileChannel,
      initial_comment: message,
      file: img,
      filename: companyName,
    });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

const postMessage = async (channel: string, text: string) => {
  try {
    await web.chat.postMessage({ channel, text });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

const postInteractivePrompt = async (
  companyName: string,
  channel: string | undefined,
  blocks: KnownBlock[]
) => {
  const text = `Help me find a profile for ${companyName}.`;
  if (channel) {
    try {
      await web.chat.postMessage({
        channel: channel,
        text: text,
        blocks: blocks,
      });
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  } else return false;
};

const postInteractiveUpdate = async (
  matchFound: boolean,
  companyId: string,
  msgTimestamp: string
) => {
  try {
    const company = await getCompany(companyId);
    const text = matchFound
      ? `A profile was chosen for ${company.name}`
      : `No profile was found for ${company.name}`;
    await web.chat.update({
      ts: msgTimestamp,
      channel: config.slackAdminChannel || "",
      text: text,
      blocks: getUpdatedSlackPayload(matchFound, company),
    });
  } catch (error) {
    console.error(error);
  }
};

const postErrorMessage = async (text: string) => {
  const channel = config.slackAdminChannel;
  if (!channel) return true; // no actual error happened so worked as expected

  try {
    await postMessage(channel, `:exclamation: Impact bot error: ${text}`);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export {
  uploadImage,
  postMessage,
  postInteractivePrompt,
  postErrorMessage,
  postInteractiveUpdate,
};
