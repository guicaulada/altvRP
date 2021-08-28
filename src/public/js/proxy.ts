const logger = getLogger("altvrp:public:proxy", "DEBUG");

type Handler = (...args: any[]) => any;
type Proxy<T> = Map<string, T> & { [key: string]: T };

const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

const proxy = new Proxy(new Map<string, Handler>(), {
  get: (_proxy, event: string) => {
    return (...args: any[]) => {
      return new Promise((resolve) => {
        const id = getProxyCallbackId(event);
        const handler = (result: any) => {
          logger.debug(`${event} ${args} @===`);
          alt.off(id, handler);
          resolve(result);
        };
        alt.on(id, handler);
        alt.emit(event, id, ...args);
        logger.debug(`${event} ${args} ===@`);
      });
    };
  },
  set: (_proxy, event: string, handler: Handler) => {
    if (_proxy.has(event)) alt.off(event, _proxy.get(event)!);
    _proxy.set(event, handler);
    alt.on(event, (...args) => {
      const id = args.shift();
      logger.debug(`${event} ${args} @===`);
      const result = handler(...args);
      alt.emit(id, result);
      logger.debug(`${event} ${args} ===@`);
    });
    return true;
  },
}) as Proxy<Handler>;
