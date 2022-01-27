import { WebClient } from "@slack/web-api";
import config from "../config";

const web = new WebClient(config.slackToken);

const uploadImage = async (img: Buffer, companyName: string) => {
  const message = `The Net Impact Profile for ${companyName} as a company. What is the impact of our work with them? See thread.`;
  await web.files.upload({
    channels: config.slackChannel,
    initial_comment: message,
    file: img,
    filename: companyName,
  });
};

export { uploadImage };
