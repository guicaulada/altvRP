import axios from 'axios';
import shared from 'core/config/shared';
import login from '../config/server';
import { DiscordToken, DiscordUser } from './types';

const formUrlEncoded = (x: Record<string, string>) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

export const getToken = async (code: string): Promise<DiscordToken> => {
  const response = await axios.post<DiscordToken>(
    `${login.DISCORD_API_URL}/oauth2/token`,
    formUrlEncoded({
      client_id: login.DISCORD_CLIENT,
      client_secret: login.DISCORD_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${shared.SERVER_API_URL}/authorize`,
    }),
  );
  return response.data;
};

export const getUser = async (token: string): Promise<DiscordUser> => {
  const response = await axios.get<DiscordUser>(`${login.DISCORD_API_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
