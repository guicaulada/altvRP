import * as alt from 'alt-server';
import shared from 'core/config/shared';
import * as crypto from 'core/server/crypto';
import * as proxy from 'core/server/proxy';
import { getLogger } from 'core/shared/logger';
import login from './config/server';
import './server/api';
import { AuthState, DiscordUser } from './server/types';

const logger = getLogger('altvrp:login');

const users = new Map<alt.Player, DiscordUser>();

proxy.local.setUser = (player, user) => {
  users.set(player, user);
};

proxy.server.getUser = (player) => {
  return users.get(player);
};

alt.onClient('pluginsLoaded', (player) => {
  logger.info(`Player "${player.name}" has joined the server`);
  proxy.client.loadLogin(
    player,
    crypto.encrypt(
      JSON.stringify({
        ip: player.ip,
        id: player.id,
        hwidExHash: player.hwidExHash,
        hwidHash: player.hwidHash,
      } as AuthState),
    ),
    login.DISCORD_CLIENT,
    `${shared.SERVER_API_URL}/authorize`,
  );
});

alt.on('playerDisconnect', (player) => {
  logger.info(`Player "${player.name}" has left the server`);
  users.delete(player);
});
