import * as alt from "alt-client";
import type { Handler, Proxy, WebProxy } from "types";
import { getLogger } from "./logger";

const logger = getLogger("altvrp:proxy");

const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

export const local = new Proxy(new Map<string, Handler>(), {
  get: (proxy, command: string) => {
    return proxy.get(command);
  },
  set: (proxy, command: string, handler: Handler) => {
    proxy.set(command, handler);
    return true;
  },
}) as Proxy;

export const client = new Proxy(new Map<string, Handler>(), {
  get: (proxy, event: string) => {
    return proxy.get(event);
  },
  set: (proxy, event: string, handler: Handler) => {
    if (proxy.has(event)) alt.offServer(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.onServer(event, async (...args) => {
      const id = args.shift();
      logger.debug(`${event} ${args} <===`);
      const result = await handler(...args);
      alt.emitServer(id, result);
      logger.debug(`${event} ${args} !===>`);
    });
    return true;
  },
}) as Proxy;

export const server = new Proxy(new Map<string, Handler>(), {
  get: (_proxy, event: string) => {
    return (...args: any[]) => {
      return new Promise((resolve) => {
        const id = getProxyCallbackId(event);
        alt.onceServer(id, (result) => {
          logger.debug(`${event} ${args} <===!`);
          resolve(result);
        });
        alt.emitServer(event, id, ...args);
        logger.debug(`${event} ${args} ===>`);
      });
    };
  },
  set: () => {
    throw TypeError("You can't set server events on client-side.");
  },
}) as Proxy;

export const webview = (view: alt.WebView) => {
  return new Proxy(new Map<string, Handler>(), {
    get: (proxy, event: string) => {
      if (proxy.has(event)) return proxy.get(event);
      if (event === "webview") return view;
      return (...args: any[]) => {
        return new Promise((resolve) => {
          const id = getProxyCallbackId(event);
          view.once(id, (result) => {
            logger.debug(`${event} ${args} <=@=!`);
            resolve(result);
          });
          view.emit(event, id, ...args);
          logger.debug(`${event} ${args} =@=>`);
        });
      };
    },
    set: (proxy, event: string, handler: Handler) => {
      if (event === "webview") {
        throw TypeError("You can't redefine the view on the webview proxy!");
      }
      if (proxy.has(event)) view.off(event, proxy.get(event)!);
      proxy.set(event, handler);
      view.on(event, async (...args) => {
        const id = args.shift();
        logger.debug(`${event} ${args} <=@=`);
        const result = await handler(...args);
        view.emit(id, result);
        logger.debug(`${event} ${args} !=@=>`);
      });
      return true;
    },
  }) as WebProxy;
};
