import * as proxy from 'core/server/proxy';
import { DiscordUser } from 'plugins/login/server/types';

proxy.server.changeModel = (player, model) => {
  player.model = model;
};

proxy.server.spawnOnCreator = (player) => {
  player.model = 'mp_m_freemode_01';
  player.spawn(-38.36043930053711, -590.017578125, 78.818359375);
  proxy.client.loadCharacterCreation(player);
};

proxy.server.createCharacter = (player, firstName, lastName, appearance) => {
  const user = proxy.server.getUser(player) as DiscordUser;
  console.log(user.id, firstName, lastName, appearance);
};
