export interface DiscordToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface AuthState {
  ip: string;
  id: number;
  hwidExHash: string;
  hwidHash: string;
}
