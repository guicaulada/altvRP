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
    "https://discord.com/api/v8/oauth2/token",
    formUrlEncoded({
      client_id: process.env.ALTV_APP_CLIENT,
      client_secret: process.env.ALTV_APP_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://sighmir.io:7789/authorize",
    })
  );
  return response.data;
};

export const getUser = async (token: string) => {
  const response = await axios.get("https://discord.com/api/v8/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
