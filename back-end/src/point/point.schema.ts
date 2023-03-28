import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Store } from 'src/store/store.schema';
import { Worker } from 'src/worker/worker.schema';

export type PointDocument = HydratedDocument<Point>;

@Schema()
export class Point {
  @Prop(
    raw({
      store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
      worker: { type: mongoose.Types.ObjectId, ref: 'Worker' },
    }),
  )
  request: Record<string, any>;

  @Prop()
  depositAmount: number;

  @Prop()
  chargePoint: number;

  @Prop({ default: 20 })
  deductPoint: number;
}

export const PointSchema = SchemaFactory.createForClass(Point);
