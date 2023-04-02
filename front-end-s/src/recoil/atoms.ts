import { atom } from "recoil";

export const storeState = atom<any>({
  key: "storeState",
  default: null,
});
