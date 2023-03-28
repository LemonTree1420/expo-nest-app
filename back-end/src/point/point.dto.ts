import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class StoreChargePointDto {
  @IsNotEmpty()
  @IsObject()
  request: {
    store: string;
  };

  @IsNotEmpty()
  @IsNumber()
  depositAmount: number;

  @IsNotEmpty()
  @IsNumber()
  chargePoint: number;
}

export class WorkerChargePointDto {
  @IsNotEmpty()
  @IsObject()
  request: {
    worker: string;
  };

  @IsNotEmpty()
  @IsNumber()
  depositAmount: number;

  @IsNotEmpty()
  @IsNumber()
  chargePoint: number;
}
