import axios from "axios";
import Hapi from "@hapi/hapi";
import config from "../../config";
import { Company, GetProfileArgs, SlackBotResponse  } from "../../../types";
import hubspot = require('@hubspot/api-client');
import { getProfile } from "../upright/profile";
import { sendError } from "../deal";
import { getDealCompanies } from "./deal";
// import { testRes } from "../../../tests/testPayload";


interface Response {
  data: {
    properties: Company;
  };
  status: number;
}

const getCompanyId = async (objectId: number) => {
  const companyIds = await getDealCompanies(objectId);
  const companyId = companyIds?.find((x) => typeof x !== undefined) as string;
  return companyId;
};

const companyRequest = async (companyId: string) => {
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

const updateUid  = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  
  const payload = request.payload as SlackBotResponse;
  const actions = payload.actions[0];
  console.log(actions.value)
  const valueObject = JSON.parse(actions.value);

  const uId = valueObject.uprightId;
  const hubSpotId = valueObject.hubSpotId;

  if( !uId ) {
    sendError("Upright ID missing", true)
    throw new Error("Upright ID missing")
  }
  if( !hubSpotId ) {
    sendError("HubSpot ID missing", true)
    throw new Error("HubSpot ID missing")
  }

  if( uId === "no_match_found" ) {
    sendError(`Upright ID not found for company`, true);
    throw new Error(`No Upright ID found for`)
  }

  const hubspotClient = new hubspot.Client({"accessToken":config.hsAccessToken});
  
  const properties = {
    "upright_id": uId
  }

  try {
    const resp = await hubspotClient.crm.companies.basicApi.update(hubSpotId, {properties})
    console.log(JSON.stringify(resp))
    return "great success";
  } catch (error) {
    console.error(error);
    return "not working";
  }
}

const getCompany = async (companyId: string, slack: boolean) => {
  const res = await companyRequest(companyId);
  if (res?.upright_id) {
    const profileArgs: GetProfileArgs = { uprightId: res.upright_id };
    if (slack) {
      profileArgs.responseType = "arraybuffer";
      return await getProfile(profileArgs);
    } else {
      profileArgs.responseType = "stream";
      return await getProfile(profileArgs);
    }
  } else {
    return await sendError(
      `Could not find an existing Upright profile on HubSpot for ${res?.name}`,
      slack
    );
  }
};

const postUprightId = async (companyId: string) => {
  // ***** CURRENTLY NOT ABLE TO TEST THIS LOCALLY WITHOUT TEST RESPONSE DATA - NEED PUBLIC DEV SPACE *******

  console.log(companyId);
  // const res = testRes;
  // const profileId = res.actions[0].value;

  // if (profileId !== "no_match_found") {
  //   const route = `${config.hsApiRoot}/companies/v2/companies/${companyId}?hapikey=${config.hsApiKey}`;
  //   try {
  //     axios
  //       .put(route, {
  //         properties: [
  //           {
  //             name: "upright_id",
  //             value: `${profileId}`,
  //           },
  //         ],
  //       })
  //       .then((res) => console.log(res));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
};

export { getCompany, updateUid, postUprightId, getCompanyId };
