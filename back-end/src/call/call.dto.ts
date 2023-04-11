import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCallDto {
  @IsNotEmpty()
  @IsString()
  store: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  customerAge: string;

  @IsNotEmpty()
  @IsNumber()
  headCount: number;

  @IsNotEmpty()
  @IsNumber()
  expectedAge: string;

  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsOptional()
  @IsString()
  memo: string;
}

export class ModifyCallDto {
  @IsOptional()
  @IsNumber()
  headCount: number;

  @IsOptional()
  @IsNumber()
  fee: number;

  @IsOptional()
  @IsString()
  memo: string;
}

export class TakeCallDto {
  @IsNotEmpty()
  @IsString()
  cellPhoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;
}
