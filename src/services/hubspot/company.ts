import axios from "axios";
import config from "../../config";
import { Company, GetProfileArgs } from "../../../types";
import { getProfile } from "../upright/profile";
import { getCompanyByName } from "../upright/search";
// import { testRes } from "../../../tests/testPayload";
interface Response {
  data: {
    properties: Company;
  };
  status: number;
}

const companyFromHubSpot = async (companyId: string) => {
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

const getCompanies = async (companyId: string, slack: boolean) => {
  const res: Company | null = await companyFromHubSpot(companyId);
  if (res?.upright_id) {
    const profileArgs: GetProfileArgs = { uprightId: res.upright_id };
    if (!slack) {
      profileArgs.responseType = "stream";
    } else {
      profileArgs.responseType = "arraybuffer";
    }
    return await getProfile(profileArgs);
  } else if (res?.name) {
    return await getCompanyByName(res.name, companyId);
  } else return null;
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

export { getCompanies, postUprightId };
