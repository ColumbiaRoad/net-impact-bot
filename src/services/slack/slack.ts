import { ActionsBlock, SectionBlock, WebClient } from "@slack/web-api";
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
  channel: string,
  payload: { blocks: (ActionsBlock | SectionBlock)[] }
) => {
  const text = "test";
  try {
    await web.chat.postMessage({
      channel: channel,
      text: text,
      blocks: payload.blocks,
    });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export { uploadImage, postMessage, postInteractivePrompt };
