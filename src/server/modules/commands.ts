import * as alt from "alt-server";
import * as proxy from "./proxy";

export const spawn = (player: alt.Player) => {
  player.spawn(-695.1956176757812, 83.94725036621094, 55.85205078125);
  player.model = "a_c_chimp";
  player.giveWeapon(0xaf113f99, 1000000, true);
};

export const veh = (player: alt.Player, model: string) => {
  const vehicle = new alt.Vehicle(
    model,
    player.pos.x,
    player.pos.y,
    player.pos.z,
    player.rot.x,
    player.rot.y,
    player.rot.z
  );
  proxy.client.setPlayerIntoVehicle(player, vehicle);
};
