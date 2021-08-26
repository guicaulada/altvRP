import * as alt from "alt-server";
import * as utils from "./utils";

export const server = new Proxy(new Map<string, utils.Handler>(), {
  get: (proxy, event: string) => {
    return proxy.get(event);
  },
  set: (proxy, event: string, handler: utils.Handler) => {
    if (proxy.has(event)) alt.off(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.on(event, handler);
    return true;
  },
}) as utils.Proxy<utils.Handler>;

export const client = new Proxy(new Map<string, utils.PlayerHandler>(), {
  get: (_proxy, event: string) => {
    return (...args: any[]) => {
      return new Promise((resolve) => {
        const id = utils.getProxyCallbackId(event);
        if (utils.isPlayer(args[0])) {
          const player = args.shift();
          alt.onceClient(id, (_, result) => resolve(result));
          alt.emitClient(player, event, id, ...args);
        } else {
          const results = new Map<number, any>();
          const onlinePlayers = alt.Player.all.length;
          alt.onClient(id, (player, result) => {
            results.set(player.id, result);
            if (results.size >= onlinePlayers) {
              resolve(results);
            }
          });
          alt.emitAllClients(event, id, ...args);
        }
      });
    };
  },
  set: (proxy, event: string, handler: utils.PlayerHandler) => {
    if (proxy.has(event)) alt.offClient(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.onClient(event, (player, ...args) => {
      const id = args.shift();
      const result = handler(player, ...args);
      alt.emitClient(player, id, result);
    });
    return true;
  },
}) as utils.Proxy<utils.PlayerHandler & utils.Handler>;
