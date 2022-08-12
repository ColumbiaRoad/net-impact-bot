import Hapi from "@hapi/hapi";
import { getCompany, getHSCompanyId } from "../services/hubspot/company";
import { postErrorMessage, uploadImage } from "../services/slack/slack";
import { DealPayload, GetProfileArgs } from "../../types";
import { getProfile } from "../services/upright/profile";

const getUprightProfile = async (dealId: number, slack: boolean) => {
  try {
  const companyId = await getHSCompanyId(dealId);
  const company = await getCompany(companyId);
  if (company?.upright_id) {
    const profileArgs: GetProfileArgs = { uprightId: company.upright_id };
    if (slack) {
      profileArgs.responseType = "arraybuffer";
    } else {
      profileArgs.responseType = "stream";
    }
    return await getProfile(profileArgs);
  } else {
    await postErrorMessage(
      `Could not find an existing Upright profile on HubSpot for ${
        company?.name || dealId
      }`
    );
    return null;
  }
} catch (error) {
  console.error(error);
  return null;
}
};

const handlePostDeal = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const payload = request.payload as DealPayload;
  const profile = await getUprightProfile(payload.objectId, true);
  if (!profile) {
    return h
      .response(
        `Could not find an existing Upright profile on HubSpot for ${payload.objectId}`
      )
      .code(404);
  }
  try {
    await uploadImage(profile as Buffer, ""); //TODO: GET COMPANY NAME
  } catch (error) {
    console.error(error);
    return h.response(`ERROR: ${error}`).code(204);
  }
  return "ok";
};

const handleGetUprightProfile = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const profile = await getUprightProfile(request.params.id, false);
  if (!profile) {
    return h
      .response(
        `Could not find an existing Upright profile on HubSpot for deal ${request.params.id}`
      )
      .code(404);
  }
  return profile;
};

async function sendError(message: string, slack: boolean) {
  return slack ? await postErrorMessage(message) : console.error(message);
}

export { handlePostDeal, handleGetUprightProfile, sendError };
