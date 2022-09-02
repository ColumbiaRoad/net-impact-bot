import { KnownBlock, WebClient } from "@slack/web-api";
import config from "../../config";
import { getCompany } from "../hubspot/company";
import { getUpdatedSlackPayload } from "./interactiveUpdatedPayload";

const web = new WebClient(config.slackToken);

const uploadImage = async (
  img: Buffer,
  companyName: string,
  message: string
) => {
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
  channel: string,
  blocks: KnownBlock[]
) => {
  const text = `Help me find a profile for ${companyName}.`;
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
