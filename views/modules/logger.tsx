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

export const getLogger = (name: string, level: Level = Level.DEBUG): Logger => {
  const log = (text: any[], logLevel: Level) => {
    if (level >= logLevel) {
      console.log(`[${Level[logLevel]}] [${name}]`, ...text);
    }
  };
  return {
    debug: (...text: any[]) => log(text, Level.DEBUG),
    info: (...text: any[]) => log(text, Level.INFO),
    warn: (...text: any[]) => log(text, Level.WARN),
    error: (...text: any[]) => log(text, Level.ERROR),
  };
};
