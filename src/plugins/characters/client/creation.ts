import * as alt from 'alt-client';
import * as proxy from 'core/client/proxy';
import config from 'core/config/shared';
import './client/appearance';
import { Appearance, Parents } from './types';

proxy.client.loadCharacterCreation = () => {
  proxy.client.createCharacterCreationCam();

  const appearance: Appearance = {
    model: 'mp_m_freemode_01',
    hair: { style: 0, color: 0, highlight: 0 },
    overlays: [],
    parents: {
      faceMix: 0.5,
      skinMix: 0.5,
      father: { face: 0, skin: 0 },
      mother: { face: 0, skin: 0 },
    },
  };

  const view = proxy.webview(new alt.WebView(`${config.VIEWS_URL}/ui/character/creation`, true));

  alt.toggleGameControls(false);
  alt.showCursor(true);
  view.webview.focus();

  proxy.client.setPedHeadBlendData();

  view.setGender = async (gender: 'm' | 'f') => {
    appearance.model = `mp_${gender}_freemode_01`;
    proxy.server.changeModel(appearance.model);
    alt.setTimeout(() => {
      proxy.client.setPedHeadBlendData(appearance);
      proxy.client.setComponentVariation(2, appearance.hair.style);
      proxy.client.setHairColor(appearance.hair.color, appearance.hair.highlight);
      appearance.overlays.forEach((overlay, id) => {
        if (overlay) {
          proxy.client.setHeadOverlay(id, overlay.value, overlay.opacity);
        }
      });
    }, 1000);
  };

  view.setAppearance = (data: Parents) => {
    appearance.parents = data;
    proxy.client.setPedHeadBlendData(appearance);
  };

  view.setHairstyle = (style: number) => {
    appearance.hair.style = style;
    proxy.client.setComponentVariation(2, style);
  };

  view.setHairColor = (color: number, highlight: number) => {
    appearance.hair.color = color;
    appearance.hair.highlight = highlight;
    proxy.client.setHairColor(color, highlight);
  };

  view.setHeadOverlay = (id: number, value: number, opacity: number) => {
    appearance.overlays[id] = { value, opacity };
    proxy.client.setHeadOverlay(id, value, opacity);
  };
};
