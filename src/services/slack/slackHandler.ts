import Hapi from "@hapi/hapi";

const postProfile = async (
  _request: Hapi.Request,
  _h: Hapi.ResponseToolkit
) => {
  return "ok";
};

export { postProfile };
