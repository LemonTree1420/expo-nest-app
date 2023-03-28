import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Auth } from 'src/auth/auth.constants';

export type StoreDocument = HydratedDocument<Store>;

@Schema()
export class Store {
  _id: Types.ObjectId;

  @Prop({ unique: true })
  userId: string;

  @Prop({ default: Auth.STORE })
  auth: string;

  @Prop({ select: false })
  password: string;

  @Prop({ select: false })
  pin: string;

  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop({ unique: true })
  cellPhoneNumber: string;

  @Prop()
  address1: string;

  @Prop()
  address2: string;

  @Prop()
  region: string;

  @Prop({ default: 0 })
  point: number;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
