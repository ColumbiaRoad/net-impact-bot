import Hapi from "@hapi/hapi";
import { getCompany, getHSCompanyId } from "../services/hubspot/company";
import { postErrorMessage, uploadImage } from "../services/slack/slack";
import { DealPayload, GetProfileArgs } from "../../types";
import { getProfile } from "../services/upright/profile";
import config from "../config";

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
  const companyId = await getHSCompanyId(payload.objectId);
  const company = await getCompany(companyId);
  const companyName = company?.name || companyId;
  const profile = await getUprightProfile(payload.objectId, true);
  if (!profile) {
    return h
      .response(
        `Could not find an existing Upright profile on HubSpot for ${payload.objectId}`
      )
      .code(404);
  }
  try {
    const URlink = `${config.uprightPlatformRoot}/company/${company.upright_id}`;
    let message;
    console.log(config.botAdmin);
    config.botAdmin === "Futurice"
      ? (message =
          "*Futurice NetImpactBooster 3000*\n Collaboration with " +
          companyName +
          " :star: How might we help <" +
          URlink +
          "|this client> to improve their Net Impact on the world via this — or upcoming engagements? :earth_africa: How might we identify & deliver measurable and sustainable business outcomes together? Let's discuss in the thread! :point_right: See more about Net Impact from <go.futurice.com/responsibility|go.futurice.com/responsibility>")
      : (message = `The Net Impact Profile for ${companyName} as a company. What is the impact of our work with them? Let's discuss in the thread!`);
    await uploadImage(profile as Buffer, companyName, message);
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

const handleGetUprightProfileURL = async (
  request: Hapi.Request,
  _h: Hapi.ResponseToolkit
) => {
  try {
    const companyId = await getHSCompanyId(request.params.id);
    const company = await getCompany(companyId);
    if (company?.upright_id)
      return `${config.uprightPlatformRoot}/company/${company.upright_id}`;
  } catch (error) {
    console.error(error);
  }
  return null;
};

async function sendError(message: string, slack: boolean) {
  return slack ? await postErrorMessage(message) : console.error(message);
}

export {
  handlePostDeal,
  handleGetUprightProfile,
  handleGetUprightProfileURL,
  sendError,
};
