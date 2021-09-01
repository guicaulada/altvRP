import * as alt from "alt-server";

interface AuthState {
  ip: string;
  id: number;
  hwidExHash: string;
  hwidHash: string;
}

export const authPlayer = (state: AuthState) => {
  const player = alt.Player.getByID(state.id);
  if (
    player &&
    player.ip === state.ip &&
    player.hwidExHash === state.hwidExHash &&
    player.hwidHash === state.hwidHash
  ) {
    return player;
  }
  return;
};
