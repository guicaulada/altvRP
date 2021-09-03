import * as alt from "alt-server";
import { crypto, getLogger, proxy } from "../../server";

const logger = getLogger("altvrp:login");

alt.on("playerConnect", (player) => {
  logger.info(`Player "${player.name}" has joined the server`);
  proxy.client.loadLogin(
    player,
    crypto.encrypt(
      JSON.stringify({
        ip: player.ip,
        id: player.id,
        hwidExHash: player.hwidExHash,
        hwidHash: player.hwidHash,
      })
    )
  );
});
