import { init } from "./server";
import type {
  IncomingMessage,
  ServerResponse,
  Server as HTTPServer,
} from "http";

type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;

// Extend Node's HTTP server to expose Hapi’s internal _events
interface HapiServerWithRequestEvent extends HTTPServer {
  _events: {
    request: RequestListener;
  };
}

const listenerPromise: Promise<RequestListener> = init().then((server) => {
  const hapiHttpServer = server.listener as HapiServerWithRequestEvent;
  return hapiHttpServer._events.request;
});

export default listenerPromise;
