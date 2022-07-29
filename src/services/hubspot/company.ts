import axios from "axios";
import config from "../../config";
import { Company, GetProfileArgs } from "../../../types";
import { getProfile } from "../upright/profile";
import { getCompanyByName } from "../upright/search";
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
        properties: "name,vatin,isin,upright_id",
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

const getCompany = async (companyId: string) => {
  const res = await companyRequest(companyId);
  if (res) {
    if (res.upright_id) {
      const profileArgs: GetProfileArgs = {
        uprightId: res.upright_id,
        responseType: "arraybuffer",
      };
      return await getProfile(profileArgs);
    } else {
      return await getCompanyByName(res.name, companyId);
    }
  } else return;
};

async function getCompanyPNG(companyId: string) {
  const res = await companyRequest(companyId);
  if (res) {
    if (res.upright_id) {
      const profileArgs: GetProfileArgs = {
        uprightId: res.upright_id,
        responseType: "stream",
      };
      return await getProfile(profileArgs);
    } else {
      return await sendError(
        `Could not find an existing Upright profile on HubSpot for ${res?.name}`,
        false
      );
    }
  } else return;
}

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

export { getCompany, postUprightId, getCompanyId, getCompanyPNG };
