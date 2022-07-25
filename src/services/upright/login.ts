import axios from "axios";
import config from "../../config";

const getLoginData = async () => {
  try {
    const response = await axios
      .post(`${config.uprightInternalApiRoot}/login`, {
        email: config.uprightLogin,
        password: config.uprightPW,
      })
      .then((response) => response.data);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getLoginData };
