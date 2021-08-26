import * as alt from "alt-client";
import * as utils from "./utils";

export const client = new Proxy(new Map<string, utils.Handler>(), {
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

export const server = new Proxy(new Map<string, utils.Handler>(), {
  get: (_proxy, event: string) => {
    return (...args: any[]) => {
      return new Promise((resolve) => {
        const id = utils.getProxyCallbackId(event);
        alt.onceServer(id, (result) => resolve(result));
        alt.emitServer(event, id, ...args);
      });
    };
  },
  set: (proxy, event: string, handler: utils.Handler) => {
    if (proxy.has(event)) alt.offServer(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.onServer(event, (...args) => {
      const id = args.shift();
      const result = handler(...args);
      alt.emitServer(id, result);
    });
    return true;
  },
}) as utils.Proxy<utils.Handler>;
