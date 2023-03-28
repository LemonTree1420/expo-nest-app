import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Store } from 'src/store/store.schema';

export type CallDocument = HydratedDocument<Call>;

@Schema()
export class Call {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  store: Store;

  @Prop()
  customerAge: number;

  @Prop()
  headCount: number;

  @Prop()
  expectedAge: number;

  @Prop()
  fee: number;

  @Prop({ unique: true })
  workerNumbers: string[];

  @Prop()
  memo: string;

  @Prop({ default: false })
  status: boolean;
}

export const CallSchema = SchemaFactory.createForClass(Call);
