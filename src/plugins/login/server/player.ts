import * as alt from 'alt-server';
import { AuthState } from './types';

export const authPlayer = (state: AuthState): alt.Player | void => {
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
