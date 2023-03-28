import { atom } from "recoil";

export const workerState = atom<any>({
  key: "workerState",
  default: null,
});
