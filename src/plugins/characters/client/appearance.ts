import * as alt from 'alt-client';
import * as proxy from 'core/client/proxy';
import * as game from 'natives';
import { Parents } from './types';

proxy.client.setPedHeadBlendData = (data?: Parents) => {
  const pid = alt.Player.local.scriptID;
  return game.setPedHeadBlendData(
    pid,
    data ? data.mother.face : 0,
    data ? data.father.face : 0,
    0,
    data ? data.mother.skin : 0,
    data ? data.father.skin : 0,
    0,
    data ? data.faceMix : 0,
    data ? data.skinMix : 0,
    0,
    false,
  );
};

proxy.client.setComponentVariation = (component?: number, drawable = 0) => {
  const pid = alt.Player.local.scriptID;
  if (component === undefined) {
    return game.setPedDefaultComponentVariation(pid);
  }
  game.setPedComponentVariation(pid, component, drawable, 0, 0);
};

proxy.client.setHairColor = (color = 0, highlight = 0) => {
  const pid = alt.Player.local.scriptID;
  game.setPedHairColor(pid, color, highlight);
};

proxy.client.createCharacterCreationCam = () => {
  const cam = game.createCamWithParams(
    'DEFAULT_SCRIPTED_CAMERA',
    -38.06043930053711,
    -589.017578125,
    79.218359375,
    0.0,
    0.0,
    160.0,
    70.0,
    true,
    2,
  );
  game.setCamActive(cam, true);
  game.renderScriptCams(true, false, 1, true, true, 0);
  return cam;
};

proxy.client.setHeadOverlay = (id: number, value = 255, opacity = 1.0) => {
  const pid = alt.Player.local.scriptID;
  game.setPedHeadOverlay(pid, id, value, opacity);
};
