import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateManagerDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsString()
  accountHolder: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;
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
