import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Auth } from './auth.constants';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class PinDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  pin: string;
}

export class AuthTokenDto {
  @IsNotEmpty()
  @IsString()
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(Auth)
  auth: string;
}
