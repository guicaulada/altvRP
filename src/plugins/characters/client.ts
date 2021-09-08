import * as alt from "alt-client";
import * as proxy from "core/client/proxy";
import * as config from "core/config/shared";
import * as game from "natives";
import { AppearanceData } from "./client/types";

proxy.client.setPedHeadBlendData = (data?: AppearanceData) => {
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
    false
  );
};

proxy.client.setComponentVariation = (
  component?: number,
  drawable: number = 0
) => {
  const pid = alt.Player.local.scriptID;
  if (component === undefined) {
    return game.setPedDefaultComponentVariation(pid);
  }
  game.setPedComponentVariation(pid, component, drawable, 0, 0);
};

proxy.client.setHairColor = (color: number = 0, highlight: number = 0) => {
  const pid = alt.Player.local.scriptID;
  game.setPedHairColor(pid, color, highlight);
};

proxy.client.createCharacterCreationCam = () => {
  const cam = game.createCamWithParams(
    "DEFAULT_SCRIPTED_CAMERA",
    -38.06043930053711,
    -589.017578125,
    79.218359375,
    0.0,
    0.0,
    160.0,
    70.0,
    true,
    2
  );
  game.setCamActive(cam, true);
  game.renderScriptCams(true, false, 1, true, true, 0);
  return cam;
};

proxy.client.loadCharacterCreation = () => {
  proxy.client.createCharacterCreationCam();

  let model = `mp_m_freemode_01`;
  let hairstyle = 0;
  let appearance: AppearanceData = {
    faceMix: 0.5,
    skinMix: 0.5,
    father: { face: 0, skin: 0 },
    mother: { face: 0, skin: 0 },
  };

  const view = proxy.webview(
    new alt.WebView(
      `${config.VIEWS_URL}/ui/character/creation/appearance`,
      true
    )
  );

  alt.toggleGameControls(false);
  alt.showCursor(true);
  view.webview.focus();

  proxy.client.setPedHeadBlendData();

  view.setGender = async (gender: string) => {
    model = `mp_${gender}_freemode_01`;
    proxy.server.changeModel(model);
    alt.setTimeout(() => {
      proxy.client.setPedHeadBlendData(appearance);
      proxy.client.setComponentVariation(2, hairstyle);
    }, 1000);
  };

  view.setAppearance = (data: AppearanceData) => {
    appearance = data;
    proxy.client.setPedHeadBlendData(appearance);
  };

  view.setHairstyle = (style: number) => {
    hairstyle = style;
    proxy.client.setComponentVariation(2, style);
  };

  view.setHairColor = (color: number, highlight: number) => {
    proxy.client.setHairColor(color, highlight);
  };
};
