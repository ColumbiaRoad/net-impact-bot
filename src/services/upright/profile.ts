import axios from "axios";
import Boom from "@hapi/boom";
import config from "../../config";
import { UprightId } from "../../../types";

interface Response {
  data: Buffer;
}

const getProfile = async (uprightId: UprightId) => {
  const route = `${config.uprightApiRoot}/profile`;
  try {
    const response: Response = await axios.get(route, {
      params: {
        [uprightId.type]: uprightId.value,
      },
      headers: {
        Authorization: config.uprightApiToken || false,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw Boom.notFound("company not found");
  }
};

export { getProfile };
