import * as alt from "alt-client";
import * as proxy from "core/client/proxy";
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

let noclip = false;
let noclipTick = 0;
proxy.client.toggleNoclip = () => {
  noclip = !noclip;
  const pid = alt.Player.local.scriptID;
  game.setPlayerInvincible(pid, noclip);
  game.freezeEntityPosition(pid, false);
  game.setEntityVisible(pid, !noclip, !noclip);
  game.setEntityCollision(pid, !noclip, !noclip);
  game.setEntityHasGravity(pid, !noclip);
  if (noclip) {
    game.setEntityMaxSpeed(pid, 0.0001);
    noclipTick = alt.everyTick(() => {
      const pos = alt.Player.local.pos;
      const dir = proxy.local.getCameraDirection();
      if (alt.isKeyToggled(87) === true) {
        game.setEntityCoordsNoOffset(
          pid,
          pos.x + dir.x,
          pos.y + dir.y,
          pos.z + dir.z,
          false,
          false,
          false
        );
      }
      if (alt.isKeyToggled(83) === true) {
        game.setEntityCoordsNoOffset(
          pid,
          pos.x - dir.x,
          pos.y - dir.y,
          pos.z - dir.z,
          false,
          false,
          false
        );
      }
    });
  } else {
    game.setEntityMaxSpeed(pid, 10);
    alt.clearEveryTick(noclipTick);
  }
};

proxy.local.getCameraDirection = () => {
  const pid = alt.Player.local.scriptID;
  const playerHeading = game.getEntityHeading(pid);
  const heading = game.getGameplayCamRelativeHeading() + playerHeading;
  const pitch = game.getGameplayCamRot(0).x;
  let x = -Math.sin((heading * Math.PI) / 180.0);
  let y = Math.cos((heading * Math.PI) / 180.0);
  let z = Math.sin((pitch * Math.PI) / 180.0);
  let len = Math.sqrt(x * x + y * y + z * z);
  if (len != 0) {
    x = x / len;
    y = y / len;
    z = z / len;
  }
  return new alt.Vector3(x, y, z);
};
