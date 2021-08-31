import * as alt from "alt-server";
import express from "express";
import { getLogger } from "../../shared/modules/logger";
import { decrypt } from "../modules/crypto";
import * as proxy from "../modules/proxy";
import { getToken, getUser } from "./helpers/discord";

interface AuthState {
  ip: string;
  id: number;
  hwidExHash: string;
  hwidHash: string;
}

const router = express.Router();
const logger = getLogger("altvrp:api:login");

const authPlayer = (state: AuthState) => {
  const player = alt.Player.getByID(state.id);
  if (
    player &&
    player.ip === state.ip &&
    player.hwidExHash === state.hwidExHash &&
    player.hwidHash === state.hwidHash
  ) {
    return player;
  }
  return;
};

router.get("/authorize", async (req, res) => {
  try {
    const state = JSON.parse(decrypt(req.query.state as string));
    const player = authPlayer(state);
    if (state && player) {
      const token = await getToken(req.query.code as string);
      const user = await getUser(token.access_token);
      console.log(user);
      console.log(state);
      proxy.client.closeLogin(player);
      player.spawn(-695.1956176757812, 83.94725036621094, 55.85205078125);
      player.model = "a_c_chimp";
      player.giveWeapon(0xaf113f99, 1000000, true);
      proxy.client.loadChat(player);
      return res.status(200).send();
    }
  } catch {}
  logger.error(`Invalid authorization request received from ${req.ip}`);
  return res.status(401).send();
});

export default router;
