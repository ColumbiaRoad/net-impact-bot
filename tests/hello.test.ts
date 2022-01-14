import * as Hapi from "@hapi/hapi";

import { init } from "../src/server";

describe("Hello World", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  test("Hello World endpoint works", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.payload).toEqual("Hello World2");
  });
});
