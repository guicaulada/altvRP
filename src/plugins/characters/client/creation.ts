import * as alt from 'alt-client';
import * as proxy from 'core/client/proxy';
import config from 'core/config/shared';
import { Appearance, Parents } from './types';
import * as utils from './utils';

proxy.client.loadCharacterCreation = () => {
  utils.createCharacterCreationCam();

  const appearance: Appearance = {
    model: 'mp_m_freemode_01',
    hair: { style: 0, color: 0, highlight: 0 },
    eyes: 0,
    overlays: [],
    features: [],
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

  utils.setPedHeadBlendData();

  view.setGender = async (gender: 'm' | 'f') => {
    appearance.model = `mp_${gender}_freemode_01`;
    proxy.server.changeModel(appearance.model);
    alt.setTimeout(() => {
      utils.setPedHeadBlendData(appearance.parents);
      utils.setComponentVariation(2, appearance.hair.style);
      utils.setHairColor(appearance.hair.color, appearance.hair.highlight);
      utils.setEyesColor(appearance.eyes);
      appearance.overlays.forEach((overlay, id) => {
        if (overlay) {
          utils.setHeadOverlay(id, overlay.value, overlay.opacity);
          utils.setHeadOverlayColor(id, overlay.color, overlay.highlight);
        }
      });
      appearance.features.forEach((feature, id) => {
        if (feature) {
          utils.setFaceFeature(id, feature.scale);
        }
      });
    }, 1000);
  };

  view.setAppearance = (data: Parents) => {
    appearance.parents = data;
    utils.setPedHeadBlendData(appearance.parents);
  };

  view.setHairstyle = (style: number) => {
    appearance.hair.style = style;
    utils.setComponentVariation(2, style);
  };

  view.setHairColor = (color: number, highlight: number) => {
    appearance.hair.color = color;
    appearance.hair.highlight = highlight;
    utils.setHairColor(color, highlight);
  };

  view.setHeadOverlay = (id: number, value: number, opacity: number, color = 0, highlight = 0) => {
    appearance.overlays[id] = { value, opacity, color, highlight };
    utils.setHeadOverlay(id, value, opacity);
    utils.setHeadOverlayColor(id, color, highlight);
  };

  view.setFaceFeature = (id: number, scale: number) => {
    appearance.features[id] = { scale };
    utils.setFaceFeature(id, scale);
  };

  view.setEyesColor = (color: number) => {
    appearance.eyes = color;
    utils.setEyesColor(color);
  };
};
