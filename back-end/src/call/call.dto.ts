import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCallDto {
  @IsNotEmpty()
  @IsString()
  store: string;

  @IsNotEmpty()
  @IsNumber()
  customerAge: number;

  @IsNotEmpty()
  @IsNumber()
  headCount: number;

  @IsNotEmpty()
  @IsNumber()
  expectedAge: number;

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

export class TakeCall {}
