import axios from "axios";
import Hapi from "@hapi/hapi";
import config from "../../config";
import { Company, DealPayload } from "../../../types";
import hubspot = require('@hubspot/api-client');
import { getUprightId, postErrorMessage } from "../deal";

interface Response {
  data: {
    properties: Company;
  };
  status: number;
}

const getCompany = async (companyId: string) => {
  const route = `${config.hsApiRoot}/crm/v3/objects/companies/${companyId}`;
  try {
    const response: Response = await axios.get(route, {
      params: {
        properties: "name,vatin,isin",
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

const updateUid  = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  
  const payload = request.payload as DealPayload;
  const companyId = payload.objectId.toString();
  const company = await getCompany(companyId);

  if (!company) {
     postErrorMessage(`HubSpot company not found for company id: ${companyId}`);
     throw new Error(`No HubSpot Company found for id ${companyId}`);
  }

  const upright_id = await getUprightId(company)

  if( !upright_id ) {
    postErrorMessage(`Upright ID ${upright_id} not found for company ${companyId}`);
    throw new Error(`No Upright ID found for ${upright_id}`)
  }

  const hubspotClient = new hubspot.Client({"accessToken":config.hsAccessToken});
  
  const properties = {
    "upright_id": upright_id.value
  }

  try {
    const resp = await hubspotClient.crm.companies.basicApi.update(companyId, {properties})
    console.log(JSON.stringify(resp))
    return "great success";
  } catch (error) {
    console.error(error);
    return "not working";
  }
}

export { getCompany, updateUid };
