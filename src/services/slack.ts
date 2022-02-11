import { WebClient } from "@slack/web-api";
import config from "../config";

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

export { uploadImage, postMessage };
