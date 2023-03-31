import { atom } from "recoil";

export const workerState = atom<any>({
  key: "workerState",
  default: null,
});

export const callRegionState = atom<any>({
  key: "callRegionState",
  default: null,
});
