export type FreemodeModel = 'mp_m_freemode_01' | 'mp_f_freemode_01';

export interface Parent {
  face: number;
  skin: number;
}

export interface Parents {
  skinMix: number;
  faceMix: number;
  father: Parent;
  mother: Parent;
}

export interface Hair {
  style: number;
  color: number;
  highlight: number;
}

export interface Overlay {
  value: number;
  opacity: number;
  color: number;
  highlight: number;
}

export interface Appearance {
  model: FreemodeModel;
  hair: Hair;
  overlays: Overlay[];
  parents: Parents;
}
