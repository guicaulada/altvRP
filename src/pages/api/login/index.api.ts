import { crypto, getLogger, proxy } from "@server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken, getUser } from "./helpers/discord";
import { authPlayer } from "./helpers/player";

const logger = getLogger("altvrp:api:authorize");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const state = JSON.parse(crypto.decrypt(req.query.state as string));
    const player = authPlayer(state);
    if (state && player) {
      const token = await getToken(req.query.code as string);
      const user = await getUser(token.access_token);
      console.log(user);
      proxy.client.closeLogin(player);
      // proxy.client.loadCharacterCreation(player);
      player.spawn(1850.914306640625, -229.46372985839844, 293.2996826171875);
      player.model = "a_c_chimp";
      player.giveWeapon(0xaf113f99, 1000000, true);
      proxy.client.loadChat(player);
      return res.status(200).send("OK");
    }
  } catch (err) {
    console.log(err);
  }
  logger.error(
    `Invalid authorization request received from ${req.socket.remoteAddress}`
  );
  return res.status(401).send("Unauthorized");
};

export default handler;
