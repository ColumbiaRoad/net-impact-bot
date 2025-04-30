import {
  APIGatewayProxyEvent,
  Context,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";
import { Server } from "@hapi/hapi";
import { IncomingMessage, ServerResponse } from "http";
import { init } from "./server";
import serverlessExpress from "@codegenie/serverless-express";

type HapiRequestListener = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => void;

let cachedHandler:
  | ((
      event: APIGatewayProxyEvent,
      context: Context,
      callback: Callback<APIGatewayProxyResult>
    ) => void)
  | undefined;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<void> => {
  if (!cachedHandler) {
    const hapiServer: Server = await init();
    const requestListener = (
      hapiServer.listener as unknown as {
        _events: { request: HapiRequestListener };
      }
    )._events.request;

    cachedHandler = serverlessExpress({ app: requestListener });
  }

  return cachedHandler(event, context, callback);
};
