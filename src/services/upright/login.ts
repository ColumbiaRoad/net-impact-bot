import axios from "axios";
import config from "../../config";

const getLoginData = async () => {
  try {
    const response = await axios
      .post(`${config.uprightInternalApiRoot}/login`, {
        email: config.uprightUserEmail,
        password: config.uprightUserPassword,
      })
      .then((response) => response.data);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getLoginData };
