import Hapi from "@hapi/hapi";

const getDeals = async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
  return "GET deals";
};

export default getDeals;
