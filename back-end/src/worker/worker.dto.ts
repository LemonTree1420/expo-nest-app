import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWorkerAccountDto {
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
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  cellPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  notificationToken: string;
}

export class WorkerFindOptions {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  cellPhoneNumber?: string;
}

export class UpdateWorkerAccountDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  pin?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  cellPhoneNumber?: string;

  @IsOptional()
  @IsNumber()
  point?: number;

  @IsOptional()
  @IsString()
  notificationToken?: string;
}
