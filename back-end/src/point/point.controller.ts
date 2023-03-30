import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { RequestChargePointDto, ResponseChargePointDto } from './point.dto';
import { Point } from './point.schema';
import { PointService } from './point.service';

@Controller('point')
@UseGuards(AuthGuard())
export class PointController {
  constructor(private pointService: PointService) {}

  /**
   * 포인트 충전 요청 - Store, Worker
   * @param requestChargePointDto
   * @returns
   */
  @Post('/charge/request')
  requestChargePoint(
    @Body() requestChargePointDto: RequestChargePointDto,
  ): Promise<Point> {
    return this.pointService.requestChargePoint(requestChargePointDto);
  }

  /**
   * Store 포인트 충전 - Admin
   * @param id
   * @param responseChargePointDto
   * @returns
   */
  @Patch('/charge/response/:id')
  responseChargePointStore(
    @Param('id') id: Types.ObjectId,
    @Body() responseChargePointDto: ResponseChargePointDto,
  ): Promise<Point> {
    return this.pointService.responseChargePointStore(
      id,
      responseChargePointDto,
    );
  }

  /**
   * Worker 포인트 충전 - Admin
   * @param id
   * @param responseChargePointDto
   * @returns
   */
  @Patch('/charge/response/:id')
  responseChargePointWorker(
    @Param('id') id: Types.ObjectId,
    responseChargePointDto: ResponseChargePointDto,
  ): Promise<Point> {
    return this.pointService.responseChargePointWorker(
      id,
      responseChargePointDto,
    );
  }
}
