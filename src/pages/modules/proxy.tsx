/// <reference types="@altv/types-webview" />
import { getLogger } from "./logger";

const logger = getLogger("altvrp:web:proxy");

export type EventHandler = (...args: any[]) => any;
export type EventProxy<T = EventHandler> = Map<string, T> & {
  [key: string]: T;
};

const getAlt = () => {
  if (!window.alt) {
    window.alt = {
      on: () => true,
      off: () => true,
      emit: () => true,
    };
  }
  return window.alt
};

const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

export const local = new Proxy(new Map<string, EventHandler>(), {
  get: (proxy, command: string) => {
    return proxy.get(command);
  },
  set: (proxy, command: string, handler: EventHandler) => {
    proxy.set(command, handler);
    return true;
  },
}) as EventProxy;

export const view = new Proxy(new Map<string, EventHandler>(), {
  get: (proxy, event: string) => {
    const alt = getAlt();
    if (proxy.has(event)) return proxy.get(event);
    return (...args: any[]) => {
      return new Promise((resolve) => {
        const id = getProxyCallbackId(event);
        const handler = (result: any) => {
          logger.debug(`${event} ${args} <=@=!`);
          alt.off(id, handler);
          resolve(result);
        };
        alt.on(id, handler);
        alt.emit(event, id, ...args);
        logger.debug(`${event} ${args} =@=>`);
      });
    };
  },
  set: (proxy, event: string, handler: EventHandler) => {
    const alt = getAlt();
    if (proxy.has(event)) alt.off(event, proxy.get(event)!);
    proxy.set(event, handler);
    alt.on(event, async (...args) => {
      const id = args.shift();
      logger.debug(`${event} ${args} <=@=`);
      const result = await handler(...args);
      alt.emit(id, result);
      logger.debug(`${event} ${args} !=@=>`);
    });
    return true;
  },
}) as EventProxy;
