import * as alt from "alt-server";

type Handler = (...args: any[]) => any;
type Proxy<T> = Map<string, T> & { [key: string]: T };

const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

const isPlayer = (p: alt.Player | alt.Player[]) =>
  p instanceof alt.Player ||
  (p instanceof Array && p.every((i) => i instanceof alt.Player));

export const server = new Proxy(new Map<string, Handler>(), {
  get: (proxy, event: string) => {
    return proxy.get(event);
  },
  set: (proxy, event: string, handler: Handler) => {
    if (proxy.has(event)) alt.offClient(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.onClient(event, (player, ...args) => {
      const id = args.shift();
      const result = handler(player, ...args);
      alt.emitClient(player, id, result);
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
  set: () => {
    throw TypeError("You can't set client events on server-side.");
  },
}) as Proxy<Handler>;
