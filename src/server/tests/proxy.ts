import * as alt from "alt-server";
import { getLogger } from "../../shared/modules/logger";
import * as proxy from "../modules/proxy";

const logger = getLogger("altvrp:test:proxy");

alt.on("playerConnect", async (player) =>
  logger.info(
    await proxy.client.getHello(player, "ole", "dole", "dof"),
    await proxy.client.getHello("kinka", "lane", "cof")
  )
);

try {
  proxy.client.notAllowed = () => {
    return "NOT ALLOWED TO SET CLIENT FUNCTIONS ON SERVER";
  };
} catch {
  logger.info("Proxy error check succeeded!");
}

proxy.server.getHello = (
  arg1: alt.Player | string,
  arg2: string,
  arg3: string
) => {
  logger.info(arg1, arg2, arg3);
  if (arg1 instanceof alt.Player) {
    return "HELLO CLIENT, FROM SERVER";
  }
  return "HELLO SERVER, FROM SERVER";
};

logger.info(proxy.server.getHello("call", "function", "directly"));
