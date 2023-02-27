import { atom } from "recoil";
import { asyncTokenEffect } from "./selectors";

export const tokenState = atom<string | null>({
  key: "tokenState",
  effects_UNSTABLE: [asyncTokenEffect],
});
