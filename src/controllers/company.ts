import Hapi from "@hapi/hapi";
import hsClient from "../services/hubspot/client";
import { getCompany } from "../services/hubspot/company";
import { interactiveSlackBot } from "../services/slack/interactiveSlackBot";
import { SlackBotResponse, Server, Request } from "../../types";
import { sendError } from "./deal";
import { postInteractiveUpdate } from "../services/slack/slack";

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

const debugPayload = (payload: string): void => {
  for (let i = 1; i <= payload.length; i++) {
    const payloadThisFar = payload.slice(0, i);
    try {
      JSON.parse(payload);
    } catch (e) {
      console.log("payloadThisFar.length", payloadThisFar.length);
      console.log("error payload", payloadThisFar);
      for (let j = 0; j < payloadThisFar.length; j++) {
        console.log(payloadThisFar[j]);
      }
      return;
    }
  }
  console.log("no errors found in payload");
};

const handleUpdateUid = async (
  request: Hapi.Request,
  _h: Hapi.ResponseToolkit
) => {
  const helper = request.payload as { payload: string };
  // console.log("helper", helper);
  // console.log("helper.payload", helper.payload);
  // console.log("typeof helper.payload", typeof helper.payload);
  // console.log(
  //   "decodeURIComponent(helper.payload)",
  //   decodeURIComponent(helper.payload)
  // );

  // console.log(
  //   "JSON.parse(decodeURIComponent(helper.payload))",
  //   JSON.parse(decodeURIComponent(helper.payload))
  // );
  debugPayload(helper.payload);
  const pl = JSON.parse(helper.payload) as SlackBotResponse;
  console.log("pl", pl);
  const actions = pl.actions[0];
  const [uId, hubSpotId] = actions.value.split("/");
  console.log("uId", uId);
  console.log("hubSpotId", hubSpotId);
  const matchFound = uId === "no_match_found" ? false : true;
  const properties = {
    upright_id: uId,
  };
  const msgTimestamp = pl.message.ts;

  if (!uId) {
    sendError("Upright ID missing", true);
    throw new Error("Upright ID missing");
  }
  if (!hubSpotId) {
    sendError("HubSpot ID missing", true);
    throw new Error("HubSpot ID missing");
  }

  try {
    if (matchFound) {
      await hsClient.crm.companies.basicApi.update(hubSpotId, {
        properties,
      });
    }
    postInteractiveUpdate(matchFound, hubSpotId, msgTimestamp);
    return "great success";
  } catch (error) {
    console.error(error);
    return "not working";
  }
};

export { handlePostCompany, handleUpdateUid };
