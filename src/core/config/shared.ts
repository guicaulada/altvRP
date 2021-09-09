import { LogLevel } from 'core/shared/types';

const config = {
  // LOGGER
  DEFAULT_LOG_LEVEL: LogLevel.DEBUG,

  // API
  SERVER_API_PORT: 7790,
  SERVER_IP_ADDRESS: 'sighmir.io',
  SERVER_API_URL: `http://sighmir.io:7790`,

  // VIEWS
  VIEWS_URL: 'http://sighmir.io:7789',
};

export default config;
