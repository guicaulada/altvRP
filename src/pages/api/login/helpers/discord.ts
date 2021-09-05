import { config } from "@server";
import axios from "axios";

export interface DiscordToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

const formUrlEncoded = (x: any) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");

export const getToken = async (code: string) => {
  const response = await axios.post<DiscordToken>(
    `${config.DISCORD_API_URL}/oauth2/token`,
    formUrlEncoded({
      client_id: config.DISCORD_CLIENT,
      client_secret: config.DISCORD_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: `${config.WEBSERVER_URL}/api/login`,
    })
  );
  return response.data;
};

export const getUser = async (token: string) => {
  const response = await axios.get(`${config.DISCORD_API_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
