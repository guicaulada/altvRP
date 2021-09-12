import * as alt from 'alt-client';
import * as game from 'natives';
import { Parents } from './types';

export const setPedHeadBlendData = (data?: Parents): void => {
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

export const setComponentVariation = (component?: number, drawable = 0): void => {
  const pid = alt.Player.local.scriptID;
  if (component === undefined) {
    return game.setPedDefaultComponentVariation(pid);
  }
  game.setPedComponentVariation(pid, component, drawable, 0, 0);
};

export const setHairColor = (color = 0, highlight = 0): void => {
  const pid = alt.Player.local.scriptID;
  game.setPedHairColor(pid, color, highlight);
};

export const createCharacterCreationCam = (): number => {
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

export const setHeadOverlay = (id: number, value = 255, opacity = 1.0): void => {
  const pid = alt.Player.local.scriptID;
  game.setPedHeadOverlay(pid, id, value, opacity);
};

export const setHeadOverlayColor = (id: number, color: number, highlight: number): void => {
  const pid = alt.Player.local.scriptID;
  let type = 0;
  if (id == 1 || id == 2 || id == 10) type = 1;
  else if (id == 5 || id == 8) type = 2;
  if (type) game.setPedHeadOverlayColor(pid, id, type, color, highlight);
};
