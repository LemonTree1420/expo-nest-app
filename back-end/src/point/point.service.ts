import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auth } from 'src/auth/auth.constants';
import { StoreService } from 'src/store/store.service';
import { WorkerService } from 'src/worker/worker.service';
import { RequestChargePointDto, ResponseChargePointDto } from './point.dto';
import { Point, PointDocument } from './point.schema';

@Injectable()
export class PointService {
  constructor(
    @InjectModel(Point.name) private pointModel: Model<PointDocument>,
    private readonly storeService: StoreService,
    private readonly workerService: WorkerService,
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
   * 충전 요청 중인 포인트들 받아오기
   * @returns
   */
  async getRequestPoints(): Promise<Point[]> {
    const allPoints = await this.pointModel.find();
    let requests = allPoints.filter((point) => point.responsePoint === 0);
    return requests;
  }

  /**
   * Store 포인트 충전 - Admin
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
   * Worker 포인트 충전 - Admin
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
}
