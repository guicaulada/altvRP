import * as alt from "alt-server";
import * as shared from "core/config/shared";
import * as crypto from "core/server/crypto";
import * as proxy from "core/server/proxy";
import { getLogger } from "core/shared/logger";
import * as login from "./config/server";
import "./server/api";

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
    ),
    login.DISCORD_CLIENT,
    `${shared.SERVER_API_URL}/authorize`
  );
});
