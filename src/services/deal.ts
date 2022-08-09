import Hapi from "@hapi/hapi";
import { getDealCompanies } from "./hubspot/deal";
import { getCompany } from "./hubspot/company";
import { getProfile } from "./upright/profile";
import { uploadImage, postMessage } from "./slack";
import { DealPayload, Company, UprightId } from "../../types";
import config from "../config";

const getDeals = async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  return "GET deals";
};

const postDeal = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const objectId = payload.objectId || NaN;
  const dealname = payload.properties?.dealname?.value || "";
  dealPipeline(objectId, dealname);
  return "ok";
};

const dealPipeline = async (objectId: number, dealname: string) => {
  const companyIds = await getDealCompanies(objectId);

  if (!companyIds || companyIds.length === 0) {
    await postErrorMessage(`Deal ${dealname} has no associated companies`);
    return;
  }

  for (let i = 0; i < companyIds.length; i++) {
    const companyId = companyIds[i];
    const company = await getCompany(companyId);

    if (!company) {
      await postErrorMessage(`No HubSpot Company found for id ${companyId}`);
      continue;
    }

    const uprightId = getUprightId(company);

    if (!uprightId) {
      await postErrorMessage(`No VATIN/ISIN assigned to ${company.name}`);
      continue;
    }

    const profile = await getProfile(uprightId);

    if (!profile) {
      await postErrorMessage(`No Upright profile found for ${company.name}`);
      continue;
    }

    const posted = await uploadImage(profile, company.name);

    if (!posted) {
      await postErrorMessage(
        `Uploading the profile to Slack failed for ${company.name}`
      );
    }
  }
};

export { getDeals, postDeal };

export const getUprightId = (company: Company): UprightId | null => {
  if (company.vatin) {
    return { type: "VATIN", value: company.vatin };
  } else if (company.isin) {
    return { type: "ISIN", value: company.isin };
  } else {
    return null;
  }
};

export const postErrorMessage = async (text: string) => {
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
