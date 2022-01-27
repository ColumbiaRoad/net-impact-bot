import axios from "axios";
import Boom from "@hapi/boom";
import config from "../../config";
import { UprightId, UprightResponse } from "../../../types";

const getProfile = async (uprightId: UprightId) => {
  const route = `${config.uprightApiRoot}/profile`;
  try {
    const response: UprightResponse = await axios.get(route, {
      params: {
        [uprightId.type]: uprightId.value,
        expand: "S,K,H,E",
      },
      headers: {
        Authorization: config.uprightApiToken || false,
      },
      responseType: "arraybuffer", // hat tip to https://stackoverflow.com/a/44058739
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw Boom.notFound("company not found");
  }
};

export { getProfile };
