import { atom } from "recoil";

export const adminState = atom<any>({
  key: "adminState",
  default: null,
});

export const settlementRefreshState = atom<number>({
  key: "settlementRefreshState",
  default: 0,
});
