import * as alt from 'alt-server';
import shared from 'core/config/shared';
import * as crypto from 'core/server/crypto';
import * as proxy from 'core/server/proxy';
import { getLogger } from 'core/shared/logger';
import login from './config/server';
import './server/api';
import { AuthState } from './server/types';

const logger = getLogger('altvrp:login');

alt.on('playerConnect', (player) => {
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
