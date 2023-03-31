import { Manager } from './manager.schema';

export class ManagerWithToken extends Manager {
  token: string;
}

export class AccountInfo {
  bank: string;

  accountHolder: string;

  accountNumber: string;
}
