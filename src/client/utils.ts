export type Handler = (...args: any[]) => any;
export type Proxy<T> = Map<string, T> & { [key: string]: T };

export const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;
