"use strict";

import Hapi from "@hapi/hapi";
import { Policy } from "@hapi/catbox";
import axios from "axios";
import config from "../config";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  PutSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

type Cache = Policy<unknown, { cache?: string; expiresIn: number }>;

const useAwsLambda = process.env.USE_AWS_LAMBDA === "true";
const SECRET_NAME = "uprightInternalApiToken";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const secretsClient = new SecretsManagerClient({
  region: process.env.AWS_REGION || "eu-north-1",
});

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "===".slice((b64.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function getJwtExpMs(token: string): number | undefined {
  try {
    const [, payload] = token.split(".");
    if (!payload) return undefined;
    const json = JSON.parse(base64UrlDecode(payload));
    return typeof json.exp === "number" ? json.exp * 1000 : undefined;
  } catch {
    return undefined;
  }
}

const CLOCK_SKEW_MS = 60 * 1000; // expire a minute early
function isExpired(token: string | null): boolean {
  if (!token) return true;
  const expMs = getJwtExpMs(token);
  return !!expMs && Date.now() + CLOCK_SKEW_MS >= expMs;
}

async function getTokenFromSecretsManager(): Promise<string | null> {
  try {
    const command = new GetSecretValueCommand({ SecretId: SECRET_NAME });
    const result = await secretsClient.send(command);
    console.info("✅ Retrieved token from Secrets Manager.");
    return result.SecretString ?? null;
  } catch (err) {
    console.warn("🔍 Token not found in Secrets Manager:", err);
    return null;
  }
}

async function storeTokenInSecretsManager(token: string): Promise<void> {
  try {
    const command = new PutSecretValueCommand({
      SecretId: SECRET_NAME,
      SecretString: token,
    });
    await secretsClient.send(command);
    console.info("✅ Stored token in Secrets Manager.");
  } catch (err) {
    console.error("❌ Failed to store token in Secrets Manager:", err);
  }
}

async function login(cache?: Cache): Promise<{ token: string }> {
  try {
    const { token } = await axios
      .post(`${config.uprightInternalApiRoot}/login`, {
        email: config.uprightUserEmail,
        password: config.uprightUserPassword,
      })
      .then((response) => response.data as { token: string });

    if (useAwsLambda) {
      await storeTokenInSecretsManager(token);
    } else if (cache) {
      cache.set("uprightInternalApiToken", token);
      console.info("✅ Stored token in Redis.");
    }

    return { token };
  } catch (error) {
    console.error("❌ Failed to log in to Upright:", error);
    throw new Error("Failed to login to Upright account");
  }
}

async function get(
  this: Cache,
  path: string,
  params: string,
  forceLogin = false
): Promise<unknown> {
  let token: string | null = null;

  if (useAwsLambda) {
    if (!forceLogin) {
      token = await getTokenFromSecretsManager();
    }

    if (!token || isExpired(token) || forceLogin) {
      console.info(
        "🔄 Logging in to Upright API (Secrets Manager cache miss/expired/forced)"
      );
      token = (await login()).token;
    } else {
      console.info("✅ Using cached token from Secrets Manager");
    }
  } else {
    token = (await this.get("uprightInternalApiToken")) as string;

    if (!token || isExpired(token) || forceLogin) {
      console.info(
        "🔄 Logging in to Upright API (Redis cache miss/expired/forced)"
      );
      token = (await login(this)).token;
    } else {
      console.info("✅ Using cached token from Redis");
    }
  }

  const url = `${config.uprightInternalApiRoot}/${path}?${params}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ API request failed:", error);
    if (forceLogin) throw new Error("Authentication failed");
    return await get.call(this, path, params, true);
  }
}

const uprightInternalGet = {
  name: "methods/uprightInternalGet",
  register: function (server: Hapi.Server) {
    const cacheOptions = {
      ...(useAwsLambda ? {} : { cache: "redis" }),
      expiresIn: CACHE_TTL_MS,
    };

    const cache = server.cache(cacheOptions);

    server.method("uprightInternalGet", get, {
      bind: cache,
    });
  },
};

export default uprightInternalGet;
