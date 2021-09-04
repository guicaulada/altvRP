import * as client from "alt-client";

// Proxy
export type Handler = (...args: any[]) => any;
export type Proxy<T = Handler> = Map<string, T> & { [key: string]: T };
export type WebProxy<T = Handler> = { webview: client.WebView } & Proxy<T>;

// Logger
export type Level = "DEBUG" | "INFO" | "WARN" | "ERROR";
export interface Logger {
  debug: (...text: any[]) => void;
  info: (...text: any[]) => void;
  warn: (...text: any[]) => void;
  error: (...text: any[]) => void;
}

// Plugins
export type Plugin = { name: string; path: string };
