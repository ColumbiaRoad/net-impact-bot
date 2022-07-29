import { KnownBlock, WebClient } from "@slack/web-api";
import config from "../../config";

const web = new WebClient(config.slackToken);

const uploadImage = async (img: Buffer, companyName: string) => {
  const message = `The Net Impact Profile for ${companyName} as a company. What is the impact of our work with them? See thread.`;
  try {
    await web.files.upload({
      channels: config.slackChannel,
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
  //"text" is a fallback value for the postMessage method - if "blocks" doesn't work out, slack uses "text" for the bot message
  const text = `Sorry, something went wrong. :pensive: I couldn't get the data I need to find a profile for ${companyName}.`;
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

const postErrorMessage = async (text: string) => {
  const channel = config.slackErrorChannel;
  if (!channel) return true; // no actual error happened so worked as expected

  try {
    await postMessage(channel, `:exclamation: Impact bot error: ${text}`);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export { uploadImage, postMessage, postInteractivePrompt, postErrorMessage };
