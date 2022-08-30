import Hapi from "@hapi/hapi";
import hsClient from "../services/hubspot/client";
import { getCompany } from "../services/hubspot/company";
import { interactiveSlackBot } from "../services/slack/interactiveSlackBot";
import { SlackBotResponse, Server, Request } from "../../types";
import { sendError } from "./deal";
import { postInteractiveUpdate } from "../services/slack/slack";
import config from "../config";

interface CompanyPayload {
  objectType: string;
  objectId: number;
}

const initializeCompanyMapping = async (
  hsCompanyId: string,
  server: Server
): Promise<void> => {
  try {
    const company = await getCompany(hsCompanyId);
    if (company && !company.upright_id) {
      await interactiveSlackBot(company.name, hsCompanyId, server);
    }
  } catch (error) {
    console.error(error);
  }
};

const handlePostCompany = (request: Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as CompanyPayload;
  const companyId = payload.objectId.toString();
  initializeCompanyMapping(companyId, request.server);
  return "ok";
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

  const properties = {
    upright_id: uId,
  };

  try {
    await hsClient.crm.companies.basicApi.update(hubSpotId, {
      properties,
    });
    postInteractiveUpdate(
      hubSpotId,
      `${config.hsUrlRoot}/contacts/${config.hsPortalId}/company/${hubSpotId}/properties`,
      config.slackChannel,
      pl.message.ts
    );
    return "great success";
  } catch (error) {
    console.error(error);
    return "not working";
  }
};

export { handlePostCompany, handleUpdateUid };
