import * as alt from "alt-client";
import * as proxy from "core/client/proxy";
import * as config from "core/config/shared";
import * as game from "natives";
import { AppearanceData } from "./client/types";

proxy.client.loadCharacterCreation = () => {
  let lastAppearance: AppearanceData;

  const view = proxy.webview(
    new alt.WebView(`${config.VIEWS_URL}/ui/character/creation`, true)
  );
  alt.toggleGameControls(false);
  alt.showCursor(true);
  view.webview.focus();

  proxy.server.changeModel("mp_m_freemode_01").then(async () => {
    alt.setTimeout(() => {
      game.setGameplayCamRelativeHeading(180);
    }, 1000);
  });

  view.setGender = async (gender: string) => {
    const pid = alt.Player.local.scriptID;
    const model = `mp_${gender}_freemode_01`;
    proxy.server.changeModel(model);
    alt.setTimeout(() => {
      game.setGameplayCamRelativeHeading(180);
    }, 1000);
    game.setPedHeadBlendData(
      pid,
      lastAppearance.mother.face,
      lastAppearance.father.face,
      0,
      0.0,
      lastAppearance.mother.skin,
      lastAppearance.father.skin,
      lastAppearance.faceMix,
      lastAppearance.skinMix,
      0.0,
      false
    );
  };

  view.setAppearance = (appearance: AppearanceData) => {
    const pid = alt.Player.local.scriptID;
    lastAppearance = appearance;
    game.setGameplayCamRelativeHeading(180);
    game.setPedHeadBlendData(
      pid,
      appearance.mother.face,
      appearance.father.face,
      0,
      0.0,
      appearance.mother.skin,
      appearance.father.skin,
      appearance.faceMix,
      appearance.skinMix,
      0.0,
      false
    );
  };
};
