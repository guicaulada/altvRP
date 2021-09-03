import * as alt from "alt-server";
import { getLogger, proxy } from "../../server";

const chatLogger = getLogger("altvrp:chat:message");
const cmdLogger = getLogger("altvrp:chat:command");
const mutedPlayers = new Map<number, boolean>();

const invokeCmd = (player: alt.Player, cmd: string, args: string[]) => {
  const handler = proxy.cmd[cmd];
  if (handler) {
    handler(player, ...args);
  } else {
    send(player, `{FF0000} Unknown command /${cmd}`);
  }
};

proxy.server.chatMessage = (player, msg) => {
  if (msg[0] === "/") {
    msg = msg.trim().slice(1);
    if (msg.length > 0) {
      cmdLogger.info(`${player.name}: /${msg}`);
      const args = msg.split(" ");
      const cmd = args.shift();
      invokeCmd(player, cmd, args);
    }
  } else {
    if (mutedPlayers.has(player.id)) {
      send(player, "{FF0000} You are currently muted.");
      return;
    }
    msg = msg.trim();
    if (msg.length > 0) {
      chatLogger.info(`${player.name}: ${msg}`);
      proxy.client.chatMessage(
        player.name,
        msg.replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34")
      );
    }
  }
};

export const send = (player: alt.Player, msg: string) => {
  proxy.client.chatMessage(player, null, msg);
};

export const broadcast = (msg: string) => {
  proxy.client.chatMessage(null, msg);
};

export const mutePlayer = (player: alt.Player, state: boolean) => {
  if (state) mutedPlayers.set(player.id, state);
  else mutedPlayers.delete(player.id);
};