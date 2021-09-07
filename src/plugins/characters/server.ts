import * as proxy from "core/server/proxy";

proxy.server.changeModel = (player, model) => {
  player.model = model;
};
