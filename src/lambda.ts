import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { IncomingMessage, ServerResponse } from "http";
import { init } from "./server";
import serverlessExpress from "@codegenie/serverless-express";
import type { Server } from "@hapi/hapi";

type HapiRequestListener = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => void;

// Our cached Lambda handler
let cachedHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;

/**
 * Lambda entry point.
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = (
  event,
  context,
  callback
) => {
  // Allow Lambda to return as soon as the HTTP response is sent
  context.callbackWaitsForEmptyEventLoop = false;

  // Cold start: initialize Hapi → extract its `request` listener → wrap it
  if (!cachedHandler) {
    init()
      .then((hapiServer: Server) => {
        const listener = (
          hapiServer.listener as unknown as {
            _events: { request: HapiRequestListener };
          }
        )._events.request;

        cachedHandler = serverlessExpress({ app: listener });
        cachedHandler(event, context, callback);
      })
      .catch((err) => {
        // If init() fails, surface it to API Gateway
        callback(err as Error);
      });
  }
  // Warm start: just delegate
  else {
    cachedHandler(event, context, callback);
  }
};
