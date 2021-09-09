import type { WebView } from 'alt-client';

export enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

export interface Logger {
  debug: (...text: any[]) => void;
  info: (...text: any[]) => void;
  warn: (...text: any[]) => void;
  error: (...text: any[]) => void;
}

export type Plugin = { name: string; path: string };

export type EventHandler = (...args: any[]) => any;
export type EventProxy<T = EventHandler> = Map<string, T> & {
  [key: string]: T;
};
export type WebProxy<T = EventHandler> = {
  webview: WebView;
} & EventProxy<T>;
