"use strict";

import Hapi from "@hapi/hapi";
import { Policy } from "@hapi/catbox";
import axios from "axios";
import config from "../config";

type Cache = Policy<unknown, { cache: string; expiresIn: number }>;

async function login(cache: Cache) {
  const { modelVersion, token } = await axios
    .post(`${config.uprightInternalApiRoot}/login`, {
      email: config.uprightUserEmail,
      password: config.uprightUserPassword,
    })
    .then(
      (response) => response.data as { modelVersion: string; token: string }
    );
  cache.set("uprightInternalApiVersion", modelVersion);
  cache.set("uprightInternalApiToken", token);
  return { modelVersion, token };
}

async function get(
  this: Cache,
  path: string,
  params: string,
  forceLogin = false
): Promise<unknown> {
  let modelVersion: string = (await this.get(
    "uprightInternalApiVersion"
  )) as string;
  let token: string = (await this.get("uprightInternalApiToken")) as string;
  if (forceLogin || !modelVersion || !token) {
    ({ modelVersion, token } = await login(this));
  }
  const url = `${config.uprightInternalApiRoot}/${path}/${modelVersion}?${params}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (forceLogin) {
      // The request failed even after a login so something is wrong
      throw Error("Authentication failed");
    }
    // The modelVersion or token may be outdated so try again with a login
    return await get.call(this, path, params, true);
  }
}

const uprightInternalGet = {
  name: "methods/uprightInternalGet",
  register: function (server: Hapi.Server) {
    const cache = server.cache({
      cache: "redis",
      expiresIn: 30 * 24 * 60 * 60 * 1000, // 1 month
    });
    server.method("uprightInternalGet", get, {
      bind: cache,
    });
  },
};

export default uprightInternalGet;
