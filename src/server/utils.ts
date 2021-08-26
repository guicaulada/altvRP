import * as alt from "alt-server";

export type Handler = (...args: any[]) => any;
export type PlayerHandler = (player: alt.Player, ...args: any[]) => any;
export type Proxy<T> = Map<string, T> & { [key: string]: T };

export const getProxyCallbackId = (event: string) =>
  `${event}:${Math.round(new Date().getTime())}`;

export const isPlayer = (p: alt.Player | alt.Player[]) =>
  p instanceof alt.Player ||
  (p instanceof Array && p.every((i) => i instanceof alt.Player));
