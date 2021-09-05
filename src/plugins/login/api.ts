import { api, config, crypto, getLogger, proxy } from "@server";
import * as alt from "alt-server";
import { getToken, getUser } from "./helpers/discord";

interface AuthState {
  ip: string;
  id: number;
  hwidExHash: string;
  hwidHash: string;
}

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

api.get("/authorize", async (req, res) => {
  const ip = req.ip.split(":").pop();
  try {
    const state = JSON.parse(crypto.decrypt(req.query.state as string));
    const player = authPlayer(state);
    if (state && player) {
      const token = await getToken(req.query.code as string);
      const user = await getUser(token.access_token);
      console.log(user);
      proxy.client.closeLogin(player);
      player.spawn(1850.914306640625, -229.46372985839844, 293.2996826171875);
      player.model = "a_c_chimp";
      player.giveWeapon(0xaf113f99, 1000000, true);
      proxy.client.loadChat(player, `${config.VIEWS_URL}/ui/chat`);
      return res.status(200).send("OK");
    }
  } catch (err) {
    console.log(err);
  }
  logger.error(`Invalid authorization request received from ${ip}`);
  return res.status(401).send("Unauthorized");
});