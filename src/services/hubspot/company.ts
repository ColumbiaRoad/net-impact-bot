import axios from "axios";
import Boom from "@hapi/boom";
import config from "../../config";
import { Company } from "../../../types";

interface Response {
  data: {
    properties: Company;
  };
}

const getCompany = async (companyId: string) => {
  const route = `${config.hsApiRoot}/crm/v3/objects/companies/${companyId}`;
  try {
    const response: Response = await axios.get(route, {
      params: {
        hapikey: config.hsApiKey,
        properties: "name,vatin,isin",
      },
    });
    return response.data.properties;
  } catch (error) {
    console.error(error);
    throw Boom.notFound("company not found");
  }
};

export { getCompany };
