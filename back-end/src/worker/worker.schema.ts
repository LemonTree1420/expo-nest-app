import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Auth } from 'src/auth/auth.constants';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema()
export class Worker {
  _id: Types.ObjectId;

  @Prop({ unique: true })
  userId: string;

  @Prop({ default: Auth.WORKER })
  auth: string;

  @Prop({ select: false })
  password: string;

  @Prop({ select: false })
  pin: string;

  @Prop()
  age: number;

  @Prop({ unique: true })
  cellPhoneNumber: string;

  @Prop({ default: 0 })
  point: number;

  @Prop()
  managerUserId: string;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
