import { IsNotEmpty, IsString } from 'class-validator';

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
  accountNumber: string;
}

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;
}
