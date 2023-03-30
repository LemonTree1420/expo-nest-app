import {
  Body,
  Controller,
  Get,
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
// @UseGuards(AuthGuard())
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
   * 요청자에 따른 포인트 리스트 - Store, Worker
   * @param request_id
   * @returns
   */
  @Get('/:id')
  getPointsById(
    @Param('id') request_id: Types.ObjectId,
    limit: string,
    page: string,
  ): Promise<Point[]> {
    return this.pointService.getPointsById(request_id, limit, page);
  }

  /**
   * 충전 요청 중인 포인트들 받아오기
   * @returns
   */
  @Get('/yet')
  getRequestPoints(): Promise<Point[]> {
    return this.pointService.getRequestPoints();
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
