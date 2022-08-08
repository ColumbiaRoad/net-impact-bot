import axios from "axios";
//import Hapi from "@hapi/hapi";
import config from "../../config";
import { Company } from "../../../types";
import hubspot = require('@hubspot/api-client');

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

const updateUid  = async () => { //request: Hapi.Request, _h: Hapi.ResponseToolkit) => { //companyId: string) => {
  //return "terve muailma " + companyName
  //const payload = request.payload as DealPayload;
  //const companyId = payload.objectId || NaN;

  const hubspotClient = new hubspot.Client({"accessToken":config.hsAccessToken});
  const companyId = "9278770573"  //deal id => "9664205188"
  const properties = {
    "upright_id": "hola mundo"
  }
  console.log(companyId)

  try {
    const resp = await hubspotClient.crm.companies.basicApi.update(companyId, {properties})
    console.log(JSON.stringify(resp))
    return "ouki douki";
  } catch (error) {
    console.error(error);
    return null;
  }
  /*
  const route = `${config.hsApiRoot}/v2/objects/companies/${companyId}`;
  try {
    const response: Response = await axios.patch(route,
      {
      params: {
        properties: {
          "upright_id": "hola mundo"
        }
      },
      headers: {
        Authorization: `Bearer ${config.hsAccessToken}`,
        //'Content-Type': 'application/json',
      },
    });
    console.log(response)
    return "something happened";
  } catch (error) {
    console.error(error);
    return null;
  } */
}

export { getCompany, updateUid };
