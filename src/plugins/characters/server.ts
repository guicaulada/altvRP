import * as proxy from "core/server/proxy";

proxy.server.changeModel = (player, model) => {
  player.model = model;
};

proxy.server.spawnOnCreator = (player) => {
  player.model = "mp_m_freemode_01";
  player.spawn(-38.36043930053711, -590.017578125, 78.818359375);
  proxy.client.loadCharacterCreation(player);
};
