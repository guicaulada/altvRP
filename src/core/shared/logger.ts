import * as alt from 'alt-shared';
import config from 'core/config/shared';
import { Logger, LogLevel } from 'core/shared/types';

export const getLogger = (name: string, level: LogLevel = config.DEFAULT_LOG_LEVEL): Logger => {
  const log = (text: any[], logLevel: LogLevel = LogLevel.INFO) => {
    if (level >= logLevel) {
      alt.log(`[${LogLevel[logLevel]}] [${name}]`, ...text);
    }
  };
  return {
    debug: (...text: any[]) => log(text, LogLevel.DEBUG),
    info: (...text: any[]) => log(text, LogLevel.INFO),
    warn: (...text: any[]) => log(text, LogLevel.WARN),
    error: (...text: any[]) => log(text, LogLevel.ERROR),
  };
};
