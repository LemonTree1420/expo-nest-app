import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Auth } from 'src/auth/auth.constants';

export type ManagerDocument = HydratedDocument<Manager>;

@Schema()
export class Manager {
  _id: Types.ObjectId;

  @Prop({ default: Auth.MANAGER })
  auth: string;

  @Prop({ unique: true })
  userId: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  bank: string;

  // 예금주
  @Prop()
  accountHolder: string;

  @Prop()
  accountNumber: string;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
