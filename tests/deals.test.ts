import Hapi from "@hapi/hapi";
import { init } from "../src/server";

describe("GET deals", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  test("endpoint works", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/deals",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.payload).toEqual("GET deals");
  });
});
