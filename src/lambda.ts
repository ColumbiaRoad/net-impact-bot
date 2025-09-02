import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Callback,
  Handler,
} from "aws-lambda";
import serverlessExpress from "@codegenie/serverless-express";
import appPromise from "./app";

let cachedHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  if (!cachedHandler) {
    const app = await appPromise;
    cachedHandler = serverlessExpress({ app });
  }
  return cachedHandler(event, context, callback);
};
