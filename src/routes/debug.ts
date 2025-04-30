import Hapi from "@hapi/hapi";

const debugRoute = {
  name: "routes/debug",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "GET",
      path: "/debug/cache-status",
      handler: async (request, h) => {
        try {
          const result = await request.server.methods.uprightInternalGet(
            "companies",
            `dummy=test`
          );

          return h.response({
            message: "Token retrieved successfully",
            result,
          });
        } catch (err) {
          return h
            .response({
              error: (err as Error).message,
            })
            .code(500);
        }
      },
    });
  },
};

export default debugRoute;
