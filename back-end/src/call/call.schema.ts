import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Store } from 'src/store/store.schema';

export type CallDocument = HydratedDocument<Call>;

@Schema()
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

  @Prop()
  expectedAge: number;

  @Prop()
  fee: number;

  @Prop()
  workerNumbers: string[];

  @Prop()
  memo: string;
}

export const CallSchema = SchemaFactory.createForClass(Call);
