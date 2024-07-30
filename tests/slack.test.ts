import { WebClient } from "@slack/web-api";
import { Buffer } from "buffer";
import { uploadImage } from "../src/services/slack/slack";
import config from "../src/config";

jest.mock("@slack/web-api", () => {
  const mSlack = {
    files: {
      upload: jest.fn(),
    },
  };
  return { WebClient: jest.fn(() => mSlack) };
});

describe("Upload to Slack", () => {
  const buff = Buffer.from("test");
  const name = "Test Company";
  let slack: WebClient;

  beforeAll(() => {
    slack = new WebClient();
  });

  test("returns true if worked", async () => {
    const posted = await uploadImage(buff, name, null);
    expect(slack.files.upload).toBeCalledWith({
      channels: config.slackProfileChannel,
      initial_comment: `The Net Impact Profile for ${name} as a company. What is the impact of our work with them? See thread.`,
      file: buff,
      filename: name,
    });
    expect(posted).toBe(true);
  });

  test("returns false if didn't work", async () => {
    const uploadMock = slack.files.upload as jest.MockedFunction<
      typeof slack.files.upload
    >;
    uploadMock.mockRejectedValue(() => new Error("slack error"));
    const posted = await uploadImage(buff, name, null);
    expect(slack.files.upload).toBeCalled();
    expect(posted).toBe(false);
  });
});
