import * as alt from "alt-server";
import { getLogger } from "../../shared/modules/logger";
import { encrypt } from "./crypto";
import * as proxy from "./proxy";

const logger = getLogger("altvrp:login");

alt.on("playerConnect", (player) => {
  logger.info(`Player "${player.name}" has joined the server`);
  proxy.client.loadLogin(
    player,
    encrypt(
      JSON.stringify({
        ip: player.ip,
        id: player.id,
        hwidExHash: player.hwidExHash,
        hwidHash: player.hwidHash,
      })
    )
  );
});
