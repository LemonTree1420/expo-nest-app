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

  @IsNotEmpty()
  @IsString()
  notificationToken: string;
}

export class UpdateAccountDto {
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
  @IsString()
  notificationToken?: string;
}
