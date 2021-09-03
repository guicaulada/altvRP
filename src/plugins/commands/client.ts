import { proxy } from "@client";
import * as alt from "alt-client";
import * as game from "natives";

proxy.client.setPlayerIntoVehicle = (veh: alt.Vehicle, seat: number = -1) => {
  let cleared = false;
  const interval = alt.setInterval(() => {
    const vehicleScriptId = veh.scriptID;
    if (vehicleScriptId) {
      game.setPedIntoVehicle(alt.Player.local.scriptID, vehicleScriptId, seat);
      alt.clearInterval(interval);
      cleared = true;
    }
  }, 10);
  alt.setTimeout(() => {
    if (!cleared) {
      alt.clearInterval(interval);
    }
  }, 5000);
};
