import axios from "axios";
import Boom from "@hapi/boom";
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
    if (response.status !== 200) {
      console.error("hubspot get failed for company id", companyId);
      throw Boom.notFound("company not found");
    }
    return response.data.properties;
  } catch (error) {
    console.error(error);
    throw Boom.notFound("company not found");
  }
};

export { getCompany };
