import { WebClient } from "@slack/web-api";
import config from "../config";

const web = new WebClient(config.slackToken);

const uploadImage = async (img: Buffer) => {
  const result = await web.files.upload({
    channels: config.slackChannel,
    initial_comment: "Testing",
    file: img,
  });
  console.log(result);
};

export { uploadImage };
