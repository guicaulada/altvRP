import { Level } from "./modules/logger";

export const DEFAULT_LOG_LEVEL = Level.DEBUG;

export const DISCORD_CLIENT = process.env.DISCORD_CLIENT!;
export const DISCORD_SECRET = process.env.DISCORD_SECRET!;
export const CRYPTO_SECRET = process.env.CRYPTO_SECRET!;

export const SERVER_API_PORT = 7790;
export const SERVER_IP_ADDRESS = "sighmir.io";
export const DISCORD_API_URL = "https://discord.com/api/v8";

export const LOCAL_VIEWS = true;
export const VIEWS_URL = "http://sighmir.io:7789";

export const SERVER_API_URL = `http://${SERVER_IP_ADDRESS}:${SERVER_API_PORT}`;
