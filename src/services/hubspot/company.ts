import axios from "axios";
import config from "../../config";
import { Company, GetProfileArgs } from "../../../types";
import { getProfile } from "../upright/profile";
import { getCompanyByName } from "../upright/search";

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

const getCompanies = async (companyId: string, slack: boolean) => {
  const res: Company | null = await companyFromHubSpot(companyId);
  if (res?.upright_id) {
    const profileArgs: GetProfileArgs = { uprightId: res.upright_id };
    if (!slack) {
      profileArgs.responseType = "stream";
    }
    return await getProfile(profileArgs);
  } else if (res?.name) {
    return await getCompanyByName(res.name);
  } else return null;
};

export { getCompanies };
