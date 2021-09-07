export interface ParentData {
  face: number;
  faceMix: number;
  skin: number;
  skinMix: number;
}

export interface AppearanceData {
  gender: string;
  skinMix: number;
  faceMix: number;
  father: ParentData;
  mother: ParentData;
}
