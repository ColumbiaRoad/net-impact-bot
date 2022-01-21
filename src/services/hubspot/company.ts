import axios from "axios";
import Boom from "@hapi/boom";
import config from "../../config";

interface Response {
  data: {
    properties: {
      vatin: string | null;
      isin: string | null;
    };
  };
}

const getCompany = async (companyId: string) => {
  const route = `${config.hsApiRoot}/crm/v3/objects/companies/${companyId}`;
  try {
    const response: Response = await axios.get(route, {
      params: {
        hapikey: config.hsApiKey,
        properties: "vatin,isin",
      },
    });
    return response.data.properties;
  } catch (error) {
    console.error(error);
    throw Boom.notFound("company not found");
  }
};

export { getCompany };
