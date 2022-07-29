import Hapi from "@hapi/hapi";
import { getCompany, getCompanyId, getCompanyPNG } from "./hubspot/company";
import { postErrorMessage, uploadImage } from "./slack/slack";
import { DealPayload } from "../../types";

const getDeals = async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  return "GET deals";
};

const postDeal = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const objectId = payload.objectId || NaN;
  const companyId = await getCompanyId(objectId);
  if (!companyId) {
    await sendError(
      `The HubSpot Deal ${payload.properties.dealname} has no associated companies`,
      true
    );
  }
  const company = await getCompany(companyId);
  const posted = await uploadImage(company as Buffer, "company");
  if (!posted) {
    await sendError(
      `Uploading the profile to Slack failed for ${payload.properties.dealname}`,
      true
    );
  }
  return "ok";
};

const postDealPNG = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const objectId = payload.objectId || NaN;
  const companyId = await getCompanyId(objectId);
  if (!companyId) {
    await sendError(
      `The HubSpot Deal ${payload.properties.dealname} has no associated companies`,
      false
    );
  }
  return await getCompanyPNG(companyId);
};

async function sendError(message: string, slack: boolean) {
  return slack ? await postErrorMessage(message) : console.log(message);
}

export { getDeals, postDeal, postDealPNG, sendError };
