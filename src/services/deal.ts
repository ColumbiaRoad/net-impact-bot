import Hapi from "@hapi/hapi";
import Boom from "@hapi/boom";
import { getDealCompanies } from "./hubspot/deal";
import { getCompany } from "./hubspot/company";
import { getProfile } from "./upright/profile";
import { uploadImage } from "./slack";
import { DealPayload, Company, UprightId } from "../../types";

const getDeals = async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  return "GET deals";
};

const postDeal = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as DealPayload;
  const objectId = payload.objectId || NaN;
  dealPipeline(objectId);
  return "Deal received and pipeline initiated";
};

const dealPipeline = async (objectId: number) => {
  console.log("deal received");
  const companyIds = await getDealCompanies(objectId);
  console.log("deal company id(s) deducted");
  for (let i = 0; i < companyIds.length; i++) {
    const company = await getCompany(companyIds[i]);
    console.log("company information fetched");
    const uprightId = getUprightId(company);
    if (uprightId) {
      const profile = await getProfile(uprightId);
      console.log("upright profile received");
      await uploadImage(profile, company.name);
      console.log("upright profile posted to slack");
    }
  }
};

export { getDeals, postDeal };

const getUprightId = (company: Company): UprightId | void => {
  if (company.vatin) {
    return { type: "VATIN", value: company.vatin };
  } else if (company.isin) {
    return { type: "ISIN", value: company.isin };
  } else {
    Boom.notFound("VATIN / ISIN not found");
  }
};
