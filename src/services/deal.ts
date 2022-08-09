import Hapi from "@hapi/hapi";
import { getCompany, getCompanyId } from "./hubspot/company";
import { postErrorMessage, uploadImage } from "./slack/slack";
import { DealPayload } from "../../types";

const getDeals = async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  return "GET deals";
};

const getBasicInfo = async (payload: DealPayload, slack: boolean) => {
  const objectId = payload.objectId || NaN;
  const companyId = await getCompanyId(objectId);
  if (!companyId) {
    await sendError(
      `The HubSpot Deal ${payload.properties.dealname.value} has no associated companies`,
      slack
    );
    return null;
  }
  const company = await getCompany(companyId, slack);
  if (!company) return null;
  else return company;
};

const postDeal = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const company = await getBasicInfo(payload, true);
  if (!company) return null;
  const posted = await uploadImage(company as Buffer, ""); //TODO: GET COMPANY NAME
  if (!posted) return null;
  else return "ok";
};

const postDealPNG = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  if (!payload) return null;
  const company = await getBasicInfo(payload, false);
  if (!company) return null;
  else return company;
};

async function sendError(message: string, slack: boolean) {
  return slack ? await postErrorMessage(message) : console.error(message);
}

export { getDeals, postDeal, postDealPNG, sendError };
