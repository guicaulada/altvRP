import axios from "axios";
import * as shared from "core/config/shared";
import * as login from "../config/server";

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
    `${login.DISCORD_API_URL}/oauth2/token`,
    formUrlEncoded({
      client_id: login.DISCORD_CLIENT,
      client_secret: login.DISCORD_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: `${shared.SERVER_API_URL}/authorize`,
    })
  );
  return response.data;
};

export const getUser = async (token: string) => {
  const response = await axios.get(`${login.DISCORD_API_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
