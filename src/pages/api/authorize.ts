// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { decrypt } from "../../server/modules/crypto";
import * as proxy from "../../server/modules/proxy";
import { getLogger } from "../../shared/modules/logger";
import { getToken, getUser } from "./helpers/discord";
import { authPlayer } from "./helpers/player";

const logger = getLogger("altvrp:api:authorize");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
      return res.status(200).send("OK");
    }
  } catch {}
  logger.error(
    `Invalid authorization request received from ${req.socket.remoteAddress}`
  );
  return res.status(401).send("Unauthorized");
};

export default handler;
