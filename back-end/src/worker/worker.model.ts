import { Types } from 'mongoose';
import { Worker } from './worker.schema';

export class WorkerWithToken extends Worker {
  token: string;
}
