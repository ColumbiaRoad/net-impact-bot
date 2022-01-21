import Hapi from "@hapi/hapi";
import { init } from "../src/server";

let server: Hapi.Server;

beforeAll(async () => {
  server = await init();
});

afterAll(async () => {
  await server.stop();
});

describe("GET deals", () => {
  test("endpoint works", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/deals",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.payload).toEqual("GET deals");
  });
});

describe("POST to deals", () => {
  test("missing objectId", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/deals",
      payload: {},
    });
    expect(res.statusCode).toEqual(400);
    const body = JSON.parse(res.payload);
    expect(body.statusCode).toBe(400);
    expect(body.message).toBe("Invalid request payload input");
  });

  test("objectId passed", async () => {
    const objectId = 123456;
    const res = await server.inject({
      method: "POST",
      url: "/deals",
      payload: { objectId },
    });
    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.payload);
    expect(body.objectId).toBe(objectId);
  });
});
