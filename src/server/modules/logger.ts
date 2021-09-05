import * as alt from "alt-server";
import * as config from "../config";

export enum Level {
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

export const getLogger = (
  name: string,
  level: Level = config.DEFAULT_LOG_LEVEL
): Logger => {
  const log = (text: any[], logLevel: Level = Level.INFO) => {
    if (level >= logLevel) {
      alt.log(`${name} ${Level[logLevel]}`, ...text);
    }
  };
  return {
    debug: (...text: any[]) => log(text, Level.DEBUG),
    info: (...text: any[]) => log(text, Level.INFO),
    warn: (...text: any[]) => log(text, Level.WARN),
    error: (...text: any[]) => log(text, Level.ERROR),
  };
};
