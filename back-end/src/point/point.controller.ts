import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { RequestChargePointDto, ResponseChargePointDto } from './point.dto';
import { Point } from './point.schema';
import { PointService } from './point.service';
import { Settlement } from './point.model';

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
   * 요청자에 따른 포인트 리스트 - Store, Worker
   * @param request_id
   * @returns
   */
  @Get('/request/:id')
  getPointsById(
    @Param('id') request_id: Types.ObjectId,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<Point[]> {
    return this.pointService.getPointsById(request_id, limit, page);
  }

  /**
   * manager별 요청 포인트 리스트 받아오기 - Master manager, Normal manager
   * @returns
   */
  @Get('/yet')
  getRequestPointsByManager(
    @Query('manager') managerUserId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<Point[]> {
    return this.pointService.getRequestPointsByManager(
      managerUserId,
      limit,
      page,
    );
  }

  /**
   * 요청 중인 모든 포인트 리스트 받아오기 - Master
   * @param limit
   * @param page
   * @returns
   */
  @Get('/yet/all')
  getRequestPoints(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<Point[]> {
    return this.pointService.getRequestPoints(limit, page);
  }

  /**
   * manager별 충전 완료된 포인트 리스트 받아오기 - Master manager, Normal Manager
   * @returns
   */
  @Get('/end')
  getEndPointsByManager(
    @Query('manager') managerUserId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<Point[]> {
    return this.pointService.getEndPointsByManager(managerUserId, limit, page);
  }

  /**
   * 충전 완료된 모든 모인트 리스트 받아오기 - Master
   * @param limit
   * @param page
   * @returns
   */
  @Get('/end/all')
  getEndPoints(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<Point[]> {
    return this.pointService.getEndPoints(limit, page);
  }

  /**
   * Store 포인트 충전 - Master manager, Normal Manager
   * @param id
   * @param responseChargePointDto
   * @returns
   */
  @Patch('/charge/response/store/:id')
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
   * Worker 포인트 충전 - Master manager, Normal Manager
   * @param id
   * @param responseChargePointDto
   * @returns
   */
  @Patch('/charge/response/worker/:id')
  responseChargePointWorker(
    @Param('id') id: Types.ObjectId,
    @Body() responseChargePointDto: ResponseChargePointDto,
  ): Promise<Point> {
    return this.pointService.responseChargePointWorker(
      id,
      responseChargePointDto,
    );
  }

  /**
   * 당일 전체 충전완료 금액 합계 - master
   * @returns
   */
  @Get('/today/settlement')
  getTodaySettlement(): Promise<number> {
    return this.pointService.getTodaySettlement();
  }

  /**
   * normal manager 별 당일 충전 완료 금액 합계 - master
   * @returns
   */
  @Get('/today/settlement/bymanager')
  getTodaySettlementListByManager(): Promise<Settlement[]> {
    return this.pointService.getTodaySettlementListByManager();
  }

  /**
   * 당월 전체 충전완료 금액 합계 - master
   * @returns
   */
  @Get('/month/settlement')
  getThisMonthSettlement(): Promise<number> {
    return this.pointService.getThisMonthSettlement();
  }

  /**
   * normal manager 별 당일 충전 완료 금액 합계 - master
   * @returns
   */
  @Get('/month/settlement/bymanager')
  getThisMonthSettlementListByManager(): Promise<Settlement[]> {
    return this.pointService.getThisMonthSettlementListByManager();
  }
}
