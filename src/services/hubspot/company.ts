import axios from "axios";
import config from "../../config";
import { Company } from "../../../types";

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

export { getCompany };
