import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Auth } from 'src/auth/auth.constants';
import { DEDUCT_POINT } from './point.constants';

export type PointDocument = HydratedDocument<Point>;

@Schema({ timestamps: true })
export class Point {
  _id: Types.ObjectId;

  // 요청자의 ObjectId - Store, Worker
  @Prop()
  request_id: Types.ObjectId;

  // Store or Worker
  @Prop()
  request_auth: Auth;

  @Prop()
  managerUserId: string;

  // 입금 계좌의 예금주
  @Prop()
  requestBankHolder: string;

  // 입금 계좌
  @Prop()
  requestBankAccountNum: string;

  // 입금액
  @Prop()
  depositAmount: number;

  // 충전 신청 포인트 - 입금액 / 100
  @Prop()
  requestPoint: number;

  // 충전 포인트
  @Prop({ default: 0 })
  responsePoint: number;
}

export const PointSchema = SchemaFactory.createForClass(Point);
