import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { DEDUCT_POINT } from 'src/point/point.constants';
import { Store } from 'src/store/store.schema';
import { StoreService } from 'src/store/store.service';
import { WorkerService } from 'src/worker/worker.service';
import { CreateCallDto, ModifyCallDto, TakeCallDto } from './call.dto';
import { TakeInfo } from './call.model';
import { Call, CallDocument } from './call.schema';

@Injectable()
export class CallService {
  constructor(
    @InjectModel(Call.name) private callModel: Model<CallDocument>,
    private readonly storeService: StoreService,
    private readonly workerService: WorkerService,
  ) {}

  /**
   * 콜 생성 - Store
   * @param createCallDto
   * @returns
   */
  async createCall(createCallDto: CreateCallDto): Promise<Call> {
    const store = await this.storeService.getStoreById(createCallDto.store);
    // if (store.point < DEDUCT_POINT) {
    //   throw new Error('Point is not enough. Please charge.');
    // }
    // const storeOption = { point: store.point - DEDUCT_POINT };
    // await this.storeService.updateStoreAccount(
    //   createCallDto.store,
    //   storeOption,
    // );

    const createCallOption = { ...createCallDto, region: store.region };
    return await new this.callModel(createCallOption).save();
  }

  /**
   * 생성된 콜 리스트 받아오기 - Store
   * @param storeObjectId
   * @returns
   */
  async getCallsByStore(
    storeObjectId: Types.ObjectId,
    limit: string,
    page: string,
  ): Promise<Call[]> {
    const filter = { store: storeObjectId };
    const skip = Number(page) * Number(limit);
    return await this.callModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  async getEndCallsByStore(
    storeObjectId: Types.ObjectId,
    limit: string,
    page: string,
  ): Promise<Call[]> {
    const filter = { store: storeObjectId, status: true };
    const skip = Number(page) * Number(limit);
    return await this.callModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * 생성한 콜 수정 - Store
   * @param id
   * @param modifyCallDto
   * @returns
   */
  async updateCallByStore(
    id: Types.ObjectId,
    modifyCallDto: ModifyCallDto,
  ): Promise<Call> {
    const filter = { _id: id };
    return await this.callModel.findOneAndUpdate(filter, modifyCallDto, {
      new: true,
    });
  }

  /**
   * 콜 삭제 - Store
   * @param id
   * @returns
   */
  async deleteCall(id: Types.ObjectId): Promise<void> {
    const filter = { _id: id };
    await this.callModel.findOneAndDelete(filter);
    return;
  }

  /**
   * 지역별 콜 리스트 받아오기 - Worker
   * @param region
   * @returns
   */
  async getCallByRegion(
    region: string,
    phone: string,
    age: string,
    limit: string,
    page: string,
  ): Promise<Call[]> {
    const filter = {
      region: region,
      expectedAge: age,
      'workers.cellPhoneNumber': { $not: { $regex: phone, $options: 'i' } },
    };
    const skip = Number(page) * Number(limit);
    return await this.callModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * 지역별 매칭된 콜 리스트 받아오기 - Worker
   * @param phone
   * @param age
   * @param limit
   * @param page
   * @returns
   */
  async getMatchCall(
    phone: string,
    age: string,
    limit: string,
    page: string,
  ): Promise<Call[]> {
    const filter = {
      expectedAge: age,
      'workers.cellPhoneNumber': { $regex: phone, $options: 'i' },
    };
    const skip = Number(page) * Number(limit);
    return await this.callModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * 콜 받기 - Worker
   * @param id
   * @param takeCallDto
   * @returns
   */
  async takeCall(id: Types.ObjectId, takeCallDto: TakeCallDto): Promise<Call> {
    const workerFilter = { cellPhoneNumber: takeCallDto.cellPhoneNumber };
    const worker = await this.workerService.getWorkerByOption(workerFilter);
    if (worker.point < DEDUCT_POINT) {
      throw new BadRequestException('Point is not enough. Please charge.');
    }

    const call = await this.callModel.findById(id);
    let workers = call.workers;
    workers.push(takeCallDto);
    let nowCount = call.nowCount + Number(takeCallDto.count);
    if (nowCount > call.headCount)
      throw new BadRequestException(
        'Count is Wrong. Possibility of data falsification',
      );

    const filter = { _id: id };
    const option = {
      workers: workers,
      nowCount: nowCount,
      status: nowCount === call.headCount,
    };

    const updateCall = await this.callModel.findOneAndUpdate(filter, option, {
      new: true,
    });

    const workerOption = { point: worker.point - DEDUCT_POINT };
    await this.workerService.updateWorkerAccount(worker._id, workerOption);

    return updateCall;
  }

  /**
   * 콜 취소 - Worker
   * @param id
   * @param takeCallDto
   * @returns
   */
  async cancelCall(
    id: Types.ObjectId,
    takeCallDto: TakeCallDto,
  ): Promise<Call> {
    const call = await this.callModel.findById(id);
    let workers = call.workers;
    if (
      workers.some(
        (item) => JSON.stringify(item) === JSON.stringify(takeCallDto),
      )
    ) {
      let removed = workers.filter(
        (worker) => JSON.stringify(worker) !== JSON.stringify(takeCallDto),
      );
      let nowCount = call.nowCount - Number(takeCallDto.count);
      if (nowCount > call.headCount || nowCount < 0)
        throw new BadRequestException(
          'Count is Wrong. Possibility of data falsification',
        );

      const filter = { _id: id };
      const option = {
        workers: removed,
        nowCount: nowCount,
        status: nowCount === call.headCount,
      };

      return await this.callModel.findOneAndUpdate(filter, option, {
        new: true,
      });
    } else {
      throw new Error("This call doesn't this number.");
    }
  }
}
