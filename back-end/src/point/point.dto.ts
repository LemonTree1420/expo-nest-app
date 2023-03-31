import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.constants';

export class RequestChargePointDto {
  @IsNotEmpty()
  request_id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  request_auth: Auth;

  @IsNotEmpty()
  @IsString()
  requestBankHolder: string;

  @IsNotEmpty()
  @IsString()
  requestBankAccountNum: string;

  @IsNotEmpty()
  @IsNumber()
  depositAmount: number;

  @IsNotEmpty()
  @IsNumber()
  requestPoint: number;
}

export class ResponseChargePointDto {
  @IsNotEmpty()
  @IsNumber()
  responsePoint: number;
}
