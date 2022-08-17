import axios from "axios";
import Hapi from "@hapi/hapi";
import config from "../../config";
import { Company, SlackBotResponse } from "../../../types";
import hubspot = require("@hubspot/api-client");
import { sendError } from "../../controllers/deal";
import { getDealCompanies } from "./deal";

interface Response {
  data: {
    properties: Company;
  };
  status: number;
}

const getHSCompanyId = async (objectId: number) => {
  const companyIds = await getDealCompanies(objectId);
  const companyId = companyIds?.find((x) => typeof x !== undefined) as string;
  return companyId;
};

const getCompany = async (companyId: string) => {
  const route = `${config.hsApiRoot}/crm/v3/objects/companies/${companyId}`;
  try {
    const response: Response = await axios.get(route, {
      params: {
        properties: "name,upright_id",
      },
      headers: {
        Authorization: `Bearer ${config.hsAccessToken}`,
      },
    });
    return response.data.properties;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateUid = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  const payload = request.payload as SlackBotResponse;
  const actions = payload.actions[0];
  console.log(actions.value);
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
    const resp = await hubspotClient.crm.companies.basicApi.update(hubSpotId, {
      properties,
    });
    console.log(JSON.stringify(resp));
    return "great success";
  } catch (error) {
    console.error(error);
    return "not working";
  }
};

export { getCompany, updateUid, getHSCompanyId };
