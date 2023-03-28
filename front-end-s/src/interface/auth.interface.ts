export interface AuthToken {
  _id: string;
  userId: string;
  auth: Auth;
}

export enum Auth {
  STORE = "store",
  WORKER = "worker",
}
