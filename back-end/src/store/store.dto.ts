import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStoreAccountDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  pin: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  cellPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2: string;

  @IsNotEmpty()
  @IsString()
  region: string;
}

export class StoreFindOptions {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cellPhoneNumber: string;
}

export class UpdateStoreAccountDto {
  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  pin: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  cellPhoneNumber: string;

  @IsOptional()
  @IsNumber()
  point: number;
}
