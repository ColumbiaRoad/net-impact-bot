import axios from "axios";
import config from "../../config";

interface Response {
  data: {
    results: [
      {
        id: string;
        type: string;
      }
    ];
  };
}

const getDealCompanies = async (dealId: number) => {
  const route = `${config.hsApiRoot}/crm/v3/objects/deals/${dealId}/associations/company`;
  try {
    const response: Response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${config.hsAccessToken}`,
      },
    });
    return response.data.results.map((result) => result.id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getDealCompanies };
