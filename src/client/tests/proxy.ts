import { getLogger } from "../../shared/modules/logger";
import * as proxy from "../modules/proxy";

const logger = getLogger("altvrp:test:proxy");

try {
  proxy.server.notAllowed = () => {
    return "NOT ALLOWED TO CLIENT SERVER FUNCTIONS ON CLIENT";
  };
} catch {
  logger.info("Proxy error check succeeded!");
}

proxy.server.getHello("hey", "server").then(logger.info);

proxy.client.getHello = (arg1: string, arg2: string, arg3: string) => {
  logger.info(arg1, arg2, arg3);
  if (arg1 == "call") {
    return "HELLO CLIENT, FROM CLIENT";
  }
  return "HELLO SERVER, FROM CLIENT";
};

logger.info(proxy.client.getHello("call", "function", "directly"));
