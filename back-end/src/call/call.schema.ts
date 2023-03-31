import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TakeInfo } from './call.model';

export type CallDocument = HydratedDocument<Call>;

@Schema({ timestamps: true })
export class Call {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Store' })
  store: Types.ObjectId;

  @Prop()
  region: string;

  @Prop()
  customerAge: number;

  @Prop()
  headCount: number;

  @Prop({ default: 0 })
  nowCount: number;

  @Prop()
  expectedAge: number;

  @Prop()
  fee: number;

  @Prop()
  workers: TakeInfo[];

  @Prop()
  memo: string;

  // true: 마감, false: 모집 중
  @Prop({ default: false })
  status: boolean;
}

export const CallSchema = SchemaFactory.createForClass(Call);
