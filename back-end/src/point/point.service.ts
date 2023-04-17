import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StoreService } from 'src/store/store.service';
import { WorkerService } from 'src/worker/worker.service';
import { RequestChargePointDto, ResponseChargePointDto } from './point.dto';
import { Point, PointDocument } from './point.schema';
import { ManagerService } from 'src/manager/manager.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ko';

@Injectable()
export class PointService {
  constructor(
    @InjectModel(Point.name) private pointModel: Model<PointDocument>,
    private readonly storeService: StoreService,
    private readonly workerService: WorkerService,
    private readonly managerService: ManagerService,
  ) {}

  /**
   * 포인트 충전 요청 - Store, Worker
   * @param requestChargePointDto
   * @returns
   */
  async requestChargePoint(
    requestChargePointDto: RequestChargePointDto,
  ): Promise<Point> {
    return await new this.pointModel(requestChargePointDto).save();
  }

  /**
   * 요청자에 따른 포인트 리스트 - Store, Worker
   * @param request_id
   * @returns
   */
  async getPointsById(
    request_id: Types.ObjectId,
    limit: string,
    page: string,
  ): Promise<Point[]> {
    const filter = { request_id: request_id };
    const skip = Number(page) * Number(limit);
    return await this.pointModel.find(filter).skip(skip).limit(Number(limit));
  }

  /**
   * 콜 삭제(취소) - Store, Worker, Admin
   * @param id
   * @returns
   */
  async deletePoint(id: Types.ObjectId): Promise<void> {
    const filter = { _id: id };
    return await this.pointModel.findOneAndDelete(filter);
  }

  /**
   * 요청 중인 포인트 리스트 받아오기 - Master manager
   * @returns
   */
  async getRequestPoints(limit: string, page: string): Promise<Point[]> {
    const filter = { responsePoint: 0 };
    const skip = Number(page) * Number(limit);
    return await this.pointModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * manager별 요청 포인트 리스트 받아오기 - Master manager, Normal manager
   * @param managerUserId
   * @param limit
   * @param page
   * @returns
   */
  async getRequestPointsByManager(
    managerUserId: string,
    limit: string,
    page: string,
  ): Promise<Point[]> {
    const filter = { responsePoint: 0, managerUserId: managerUserId };
    const skip = Number(page) * Number(limit);
    return await this.pointModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * 충전 완료된 포인트 리스트 받아오기 - Master manager
   * @returns
   */
  async getEndPoints(limit: string, page: string): Promise<Point[]> {
    const filter = { responsePoint: { $ne: 0 } };
    const skip = Number(page) * Number(limit);
    return await this.pointModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * manager별 충전 완료된 포인트 리스트 받아오기 - Master manager, Normal Manager
   * @returns
   */
  async getEndPointsByManager(
    managerUserId: string,
    limit: string,
    page: string,
  ): Promise<Point[]> {
    const filter = { responsePoint: { $ne: 0 }, managerUserId: managerUserId };
    const skip = Number(page) * Number(limit);
    return await this.pointModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * Store 포인트 충전 - Master manager, Normal Manager
   * @param id
   * @param responseChargePointDto
   * @returns
   */
  async responseChargePointStore(
    id: Types.ObjectId,
    responseChargePointDto: ResponseChargePointDto,
  ): Promise<Point> {
    const point = await this.pointModel.findById(id);
    if (point.requestPoint !== responseChargePointDto.responsePoint) {
      throw new Error('Request point and Response point are not same.');
    }

    const store = await this.storeService.getStoreById(point.request_id);
    if (!store) {
      throw new Error('Not Found this Store.');
    }

    const updateStoreAccountDto = {
      point: store.point + responseChargePointDto.responsePoint,
    };
    await this.storeService.updateStoreAccount(
      point.request_id,
      updateStoreAccountDto,
    );

    const filter = { _id: id };
    return await this.pointModel.findOneAndUpdate(
      filter,
      responseChargePointDto,
      { new: true },
    );
  }

  /**
   * Worker 포인트 충전 - Master manager, Normal Manager
   * @param id
   * @param responseChargePointDto
   * @returns
   */
  async responseChargePointWorker(
    id: Types.ObjectId,
    responseChargePointDto: ResponseChargePointDto,
  ): Promise<Point> {
    const point = await this.pointModel.findById(id);
    if (point.requestPoint !== responseChargePointDto.responsePoint) {
      throw new Error('Request point and Response point are not same.');
    }

    const worker = await this.workerService.getWorkerById(point.request_id);
    if (!worker) {
      throw new Error('Not Found this Worker.');
    }

    const updateWorkerAccountDto = {
      point: worker.point + responseChargePointDto.responsePoint,
    };
    await this.workerService.updateWorkerAccount(
      point.request_id,
      updateWorkerAccountDto,
    );

    const filter = { _id: id };
    return await this.pointModel.findOneAndUpdate(
      filter,
      responseChargePointDto,
      { new: true },
    );
  }

  /**
   * 당일 전체 충전완료 금액 합계 - master
   * @returns
   */
  async getTodaySettlement(): Promise<number> {
    const setToday = dayjs().set('hour', 0).set('minute', 0).set('second', 0);
    const today = setToday.toDate();
    const tomorrow = setToday.add(1, 'day').toDate();

    const filter = {
      responsePoint: { $ne: 0 },
      createdAt: { $gte: today, $lt: tomorrow },
    };

    const todayEndPoints = await this.pointModel.find(filter);
    let sumOfAmount = 0;
    todayEndPoints.map((point: any) => {
      sumOfAmount += point.depositAmount;
    });
    return sumOfAmount;
  }

  /**
   * normal manager 별 당일 충전 완료 금액 합계 - master
   * @returns
   */
  async getTodaySettlementListByManager(): Promise<any[]> {
    const setToday = dayjs().set('hour', 0).set('minute', 0).set('second', 0);
    const today = setToday.toDate();
    const tomorrow = setToday.add(1, 'day').toDate();

    const normalManagers = await this.managerService.getNormalManagers();

    let amountList = await Promise.all(
      normalManagers.map(async (manager: any) => {
        let filter = {
          managerUserId: manager.userId,
          responsePoint: { $ne: 0 },
          createdAt: { $gte: today, $lt: tomorrow },
        };
        let endPointsBymanager = await this.pointModel.find(filter);

        let sumOfAmount = 0;
        if (endPointsBymanager) {
          endPointsBymanager.map((point: any) => {
            sumOfAmount += point.depositAmount;
          });
        }
        return {
          managerUserId: manager.userId,
          sumOfAmount: sumOfAmount,
        };
      }),
    );
    return amountList;
  }

  /**
   * 당월 전체 충전완료 금액 합계 - master
   * @returns
   */
  async getThisMonthSettlement(): Promise<number> {
    const setThisMonth = dayjs()
      .set('day', 1)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);
    const thisMonth = setThisMonth.toDate();
    const nextMonth = setThisMonth.add(1, 'month').toDate();

    const filter = {
      responsePoint: { $ne: 0 },
      createdAt: { $gte: thisMonth, $lt: nextMonth },
    };

    const todayEndPoints = await this.pointModel.find(filter);
    let sumOfAmount = 0;
    todayEndPoints.map((point: any) => {
      sumOfAmount += point.depositAmount;
    });
    return sumOfAmount;
  }

  /**
   * normal manager 별 당월 충전 완료 금액 합계 - master
   * @returns
   */
  async getThisMonthSettlementListByManager(): Promise<any[]> {
    const setThisMonth = dayjs()
      .set('day', 1)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);
    const thisMonth = setThisMonth.toDate();
    const nextMonth = setThisMonth.add(1, 'month').toDate();

    const normalManagers = await this.managerService.getNormalManagers();

    let amountList = await Promise.all(
      normalManagers.map(async (manager: any) => {
        let filter = {
          managerUserId: manager.userId,
          responsePoint: { $ne: 0 },
          createdAt: { $gte: thisMonth, $lt: nextMonth },
        };
        let endPointsBymanager = await this.pointModel.find(filter);

        let sumOfAmount = 0;
        if (endPointsBymanager) {
          endPointsBymanager.map((point: any) => {
            sumOfAmount += point.depositAmount;
          });
        }
        return {
          managerUserId: manager.userId,
          sumOfAmount: sumOfAmount,
        };
      }),
    );
    return amountList;
  }
}
