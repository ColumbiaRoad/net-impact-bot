import { getCompany } from "../services/hubspot/company";
import { postErrorMessage } from "../services/slack/slack";
import Hapi from "@hapi/hapi";
import { interactiveSlackBot } from "../services/slack/interactiveSlackBot";
import { SlackBotResponse } from "../../types";
import { sendError } from "./deal";
import config from "../config";
import hubspot = require("@hubspot/api-client");
interface CompanyPayload {
  objectType: string;
  objectId: number;
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
    const companyId = payload.objectId.toString();
    const company = await getCompany(companyId);
    if (!company?.upright_id && company) {
      interactiveSlackBot(company.name, companyId, request.server);
      return "ok";
    }
    return "we already have upright ID";
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handleUpdateUid = async (
  request: Hapi.Request,
  _h: Hapi.ResponseToolkit
) => {
  const helper = request.payload as { payload: string };
  const pl = JSON.parse(decodeURIComponent(helper.payload)) as SlackBotResponse;

  const actions = pl.actions[0];
  const valueObject = JSON.parse(actions.value);

  const uId = valueObject.uprightId;
  const hubSpotId = valueObject.hubSpotId;

  if (!uId) {
    sendError("Upright ID missing", true);
    throw new Error("Upright ID missing");
  }
  if (!hubSpotId) {
    sendError("HubSpot ID missing", true);
    throw new Error("HubSpot ID missing");
  }

  if (uId === "no_match_found") {
    sendError(`Upright ID not found for company`, true);
    throw new Error(`No Upright ID found for`);
  }

  const hubspotClient = new hubspot.Client({
    accessToken: config.hsAccessToken,
  });

  const properties = {
    upright_id: uId,
  };

  try {
    await hubspotClient.crm.companies.basicApi.update(hubSpotId, {
      properties,
    });
    return "great success";
  } catch (error) {
    console.error(error);
    return "not working";
  }
};

export { handlePostCompany, handleUpdateUid };
