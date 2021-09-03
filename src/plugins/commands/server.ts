import { proxy } from "@server";
import * as alt from "alt-server";

proxy.local.registerCommand("spawn", (player: alt.Player) => {
  player.spawn(1850.914306640625, -229.46372985839844, 293.2996826171875);
  player.model = "a_c_chimp";
  player.giveWeapon(0xaf113f99, 1000000, true);
});

proxy.local.registerCommand("tower", (player: alt.Player) => {
  player.spawn(-75.33625793457031, -819.5736083984375, 326.173583984375);
  player.model = "a_c_chimp";
  player.giveWeapon(0xfbab5776, 1000000, true);
});

proxy.local.registerCommand("veh", (player: alt.Player, model: string) => {
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
});

proxy.local.registerCommand("pos", (player: alt.Player) => {
  proxy.client.chatMessage(
    player,
    null,
    `${player.pos.x}, ${player.pos.y}, ${player.pos.z}`
  );
});
