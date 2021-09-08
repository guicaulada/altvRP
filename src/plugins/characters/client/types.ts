export interface ParentData {
  face: number;
  skin: number;
}

export interface AppearanceData {
  skinMix: number;
  faceMix: number;
  father: ParentData;
  mother: ParentData;
}
