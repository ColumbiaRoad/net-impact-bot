import Hapi from "@hapi/hapi";
import { getDealCompanies } from "./hubspot/deal";
import { getCompanies } from "./hubspot/company";
import { postMessage } from "./slack";
import { DealPayload } from "../../types";
import config from "../config";

const getDeals = async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  return "GET deals";
};

const postDeal = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const objectId = payload.objectId || NaN;
  dealPipeline(objectId, true);
  return "ok";
};

const postDealPNG = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const objectId = payload.objectId || NaN;
  return await dealPipeline(objectId, false);
};

const dealPipeline = async (objectId: number, slack: boolean) => {
  const companyIds = await getDealCompanies(objectId);

  if (!companyIds || companyIds.length === 0) {
    await sendError(`HubSpot Deal has no associated companies`, slack);
    return null;
  }

  const companyId = companyIds?.find((x) => typeof x !== undefined) as string;
  const company = await getCompanies(companyId, slack);

  if (!company) {
    await sendError(`The company was not found on Upright :/`, slack);
    return null;
  }
  // *** Add back when companyByName returns a postDealPNG.***

  // if (slack) {
  //   const posted = await uploadImage(company, company.name);
  //   if (!posted) {
  //     sendError(`Uploading the profile to Slack failed for ${company.name}`, slack);
  //   }
  // }

  if (!slack && company) return company;
  return null;
};

export { getDeals, postDeal, postDealPNG };

async function sendError(message: string, slack: boolean) {
  return slack ? await postErrorMessage(message) : console.log(message);
}

const postErrorMessage = async (text: string) => {
  const channel = config.slackErrorChannel;
  if (!channel) return true; // no actual error happened so worked as expected

  try {
    await postMessage(channel, `:exclamation: Impact bot error: ${text}`);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};
