import { ResponseType } from "axios";
import Hapi from "@hapi/hapi";
import type { pino } from "pino";

export interface DealPayload {
  objectId: number;
  properties: {
    dealname: {
      value: string;
    };
  };
}

export interface DealResponse {
  data: {
    results: [
      {
        id: string;
        type: string;
      }
    ];
  };
}

export interface CompanyPayload {
  objectType: string;
  objectId: number;
}

export interface Company {
  name: string;
  objectId?: number;
  upright_id: string | null;
}

export interface UprightResponse {
  data: Buffer;
}

export interface GetProfileArgs {
  uprightId: string;
  responseType?: ResponseType;
}
export interface UprightProfile {
  id: string;
  name: string;
  type: string;
  description?: string;
  country: string;
  score: number;
  teaser: boolean;
  fuzzyProductSetQuality: string;
}

export interface SlackBotAction {
  value: string;
}

export interface SlackBotResponse {
  actions: SlackBotAction[];
  message: { ts: string };
}

export interface Server extends Hapi.Server {
  logger: pino.Logger;
}

export interface Request extends Hapi.Request {
  server: Server;
}

export class CustomError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message, options);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = "CustomError";
  }
}
