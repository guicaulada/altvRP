import * as alt from "alt-server";
import { getLogger } from "./logger";

export type Handler = (...args: any[]) => any;
export type Proxy<T> = Map<string, T> & { [key: string]: T };

const logger = getLogger("altvrp:proxy");

const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

const isPlayer = (p: alt.Player | alt.Player[]) =>
  p instanceof alt.Player ||
  (p instanceof Array && p.every((i) => i instanceof alt.Player));

export const local = new Proxy(new Map<string, Handler>(), {
  get: (proxy, command: string) => {
    return proxy.get(command);
  },
  set: (proxy, command: string, handler: Handler) => {
    proxy.set(command, handler);
    return true;
  },
}) as Proxy<Handler>;

export const server = new Proxy(new Map<string, Handler>(), {
  get: (proxy, event: string) => {
    return proxy.get(event);
  },
  set: (proxy, event: string, handler: Handler) => {
    if (proxy.has(event)) alt.offClient(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.onClient(event, async (player, ...args) => {
      const id = args.shift();
      logger.debug(`${event} ${player.id} ${args} <===`);
      const result = await handler(player, ...args);
      alt.emitClient(player, id, result);
      logger.debug(`${event} ${player.id} ${args} !===>`);
    });
    return true;
  },
}) as Proxy<Handler>;

export const client = new Proxy(new Map<string, Handler>(), {
  get: (_proxy, event: string) => {
    return (...args: any[]) => {
      return new Promise((resolve) => {
        const id = getProxyCallbackId(event);
        if (isPlayer(args[0])) {
          const player = args.shift();
          alt.onceClient(id, (_, result) => {
            logger.debug(`${event} ${player.id} ${args} <===!`);
            resolve(result);
          });
          logger.debug(`${event} ${player.id} ${args} ===>`);
          alt.emitClient(player, event, id, ...args);
        } else {
          const results = new Map<number, any>();
          const onlinePlayers = alt.Player.all.length;
          alt.onClient(id, (player, result) => {
            results.set(player.id, result);
            if (results.size >= onlinePlayers) {
              logger.debug(`${event} -1 ${args} <===!`);
              resolve(results);
            }
          });
          alt.emitAllClients(event, id, ...args);
          logger.debug(`${event} -1 ${args} ===>`);
        }
      });
    };
  },
  set: () => {
    throw TypeError("You can't set client events on server-side.");
  },
}) as Proxy<Handler>;
