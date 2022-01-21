import Hapi from "@hapi/hapi";
import { DealPayload } from "../../types";

const getDeals = async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  return "GET deals";
};

const postDeal = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const objectId = payload.objectId;

  return { objectId };
};

export { getDeals, postDeal };
