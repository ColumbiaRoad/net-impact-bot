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
  return "ok";
};

const dealPipeline = async (objectId: number) => {
  const companyIds = await getDealCompanies(objectId);
  for (let i = 0; i < companyIds.length; i++) {
    const company = await getCompany(companyIds[i]);
    const uprightId = getUprightId(company);
    if (uprightId) {
      const profile = await getProfile(uprightId);
      await uploadImage(profile, company.name);
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
