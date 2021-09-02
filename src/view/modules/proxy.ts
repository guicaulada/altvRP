import { getLogger } from "./logger";

const logger = getLogger("altvrp:public:proxy", "DEBUG");

type Handler = (...args: any[]) => any;
type Proxy<T> = Map<string, T> & { [key: string]: T };

const setupMock = () => {
  if (!window.alt) {
    window.alt = {
      on: () => true,
      off: () => true,
      emit: () => true,
    };
  }
};

const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

const proxy = new Proxy(new Map<string, Handler>(), {
  get: (prxy, event: string) => {
    setupMock();
    if (prxy.has(event)) return prxy.get(event);
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
  set: (prxy, event: string, handler: Handler) => {
    setupMock();
    if (prxy.has(event)) alt.off(event, prxy.get(event)!);
    prxy.set(event, handler);
    alt.on(event, async (...args) => {
      const id = args.shift();
      logger.debug(`${event} ${args} <=@=`);
      const result = await handler(...args);
      alt.emit(id, result);
      logger.debug(`${event} ${args} !=@=>`);
    });
    return true;
  },
}) as Proxy<Handler>;

export default proxy;
