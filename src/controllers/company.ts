import { getCompany } from "../services/hubspot/company";
import { postErrorMessage } from "../services/slack/slack";
import Hapi from "@hapi/hapi";
import { interactiveSlackBot } from "../services/slack/interactiveSlackBot";

interface CompanyPayload {
  objectType: string;
  objectId: string;
}

const handlePostCompany = async (
  request: Hapi.Request,
  _h: Hapi.ResponseToolkit
) => {
  const payload = request.payload as CompanyPayload;

  if (payload.objectType !== "COMPANY") {
    postErrorMessage("Invalid type, not company");
    throw new Error("Invalid type, not company");
  }

  try {
    const companyId = payload.objectId;
    const company = await getCompany(companyId);
    if (!company?.upright_id && company) {
      interactiveSlackBot(company.name, companyId, request.server);
      return "ok";
    }
    // postErrorMessage("company not found");
    return "we already have upright ID";
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default handlePostCompany;
