import * as alt from "alt-client";

type Handler = (...args: any[]) => any;
type Proxy<T> = Map<string, T> & { [key: string]: T };

const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

export const client = new Proxy(new Map<string, Handler>(), {
  get: (proxy, event: string) => {
    return proxy.get(event);
  },
  set: (proxy, event: string, handler: Handler) => {
    if (proxy.has(event)) alt.offServer(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.onServer(event, (...args) => {
      const id = args.shift();
      const result = handler(...args);
      alt.emitServer(id, result);
    });
    return true;
  },
}) as Proxy<Handler>;

export const server = new Proxy(new Map<string, Handler>(), {
  get: (_proxy, event: string) => {
    return (...args: any[]) => {
      return new Promise((resolve) => {
        const id = getProxyCallbackId(event);
        alt.onceServer(id, (result) => resolve(result));
        alt.emitServer(event, id, ...args);
      });
    };
  },
  set: () => {
    throw TypeError("You can't set server events on client-side.");
  },
}) as Proxy<Handler>;
