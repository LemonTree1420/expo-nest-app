import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from './manager.constants';

export class CreateManagerDto {
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
  bank: string;

  @IsNotEmpty()
  @IsString()
  accountHolder: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsOptional()
  @IsEnum(Role)
  role: string;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  accountHolder?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;
}
