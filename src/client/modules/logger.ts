import * as alt from "alt-client";
import type { Level, Logger } from "types";
import * as config from "../config";

const levels = {
  DEBUG: 4,
  INFO: 3,
  WARN: 2,
  ERROR: 1,
};

const getLevel = (type: Level) => levels[type];

const log = (logger: string, text: any[], type: Level, level: Level) => {
  if (getLevel(type) <= getLevel(level)) {
    alt.log(`${logger} ${type}`, ...text);
  }
};

export const getLogger = (
  name: string,
  level: Level = config.DEFAULT_LOG_LEVEL
): Logger => {
  return {
    debug: (...text: any[]) => log(name, text, "DEBUG", level),
    info: (...text: any[]) => log(name, text, "INFO", level),
    warn: (...text: any[]) => log(name, text, "WARN", level),
    error: (...text: any[]) => log(name, text, "ERROR", level),
  };
};
