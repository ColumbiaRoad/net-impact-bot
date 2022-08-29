import hubspot = require("@hubspot/api-client");
import config from "../../config";

const hsClient = new hubspot.Client({
  accessToken: config.hsAccessToken,
});

export default hsClient;
