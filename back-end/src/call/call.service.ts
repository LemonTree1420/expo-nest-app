import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { DEDUCT_POINT } from 'src/point/point.constants';
import { StoreService } from 'src/store/store.service';
import { WorkerService } from 'src/worker/worker.service';
import { CreateCallDto, ModifyCallDto, TakeCallDto } from './call.dto';
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
    if (store.point < DEDUCT_POINT) {
      throw new Error('Point is not enough. Please charge.');
    }
    const storeOption = { point: store.point - DEDUCT_POINT };
    await this.storeService.updateStoreAccount(
      createCallDto.store,
      storeOption,
    );

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
  async getCallByRegion(region: string): Promise<Call[]> {
    const filter = { region: region };
    return await this.callModel.find(filter);
  }

  /**
   * 콜 받기 - Worker
   * @param id
   * @param takeCallDto
   * @returns
   */
  async takeCall(id: Types.ObjectId, takeCallDto: TakeCallDto): Promise<Call> {
    const workerFilter = { cellPhoneNumber: takeCallDto.workerNumber };
    const worker = await this.workerService.getWorkerByOption(workerFilter);
    if (worker.point < DEDUCT_POINT) {
      throw new Error('Point is not enough. Please charge.');
    }

    const workerOption = { point: worker.point - DEDUCT_POINT };
    await this.workerService.updateWorkerAccount(worker._id, workerOption);

    const call = await this.callModel.findById(id);
    let workerNumbers = call.workerNumbers;
    workerNumbers.push(takeCallDto.workerNumber);

    const filter = { _id: id };
    const option = { workerNumbers: workerNumbers };

    return await this.callModel.findOneAndUpdate(filter, option, { new: true });
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
    let workerNumbers = call.workerNumbers;
    if (workerNumbers.includes(takeCallDto.workerNumber)) {
      let removed = workerNumbers.filter(
        (workerNum) => workerNum !== takeCallDto.workerNumber,
      );

      const filter = { _id: id };
      const option = { workerNumbers: removed };

      return await this.callModel.findOneAndUpdate(filter, option, {
        new: true,
      });
    } else {
      throw new Error("This call doesn't this number.");
    }
  }
}
