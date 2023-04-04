import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auth } from 'src/auth/auth.constants';
import { AuthTokenDto, LoginDto, PinDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { handleMongooseErr } from 'src/constants/handleErr';
import {
  CreateWorkerAccountDto,
  UpdateWorkerAccountDto,
  WorkerFindOptions,
} from './worker.dto';
import { WorkerWithToken } from './worker.model';
import { Worker, WorkerDocument } from './worker.schema';
import { ManagerService } from 'src/manager/manager.service';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
  ) {}

  /**
   * Worker 계정 생성
   * @param createWorkerAccountDto
   * @returns
   */
  async createWorkerAccount(
    createWorkerAccountDto: CreateWorkerAccountDto,
  ): Promise<WorkerWithToken> {
    try {
      const manager = await this.managerService.getManagerByUserId(
        createWorkerAccountDto.managerUserId,
      );
      if (!manager) {
        throw new Error('Does not exist this manager.');
      }
      const createdWorker = new this.workerModel(createWorkerAccountDto);

      const hashedPassword = await this.authService.encryptSecret(
        createWorkerAccountDto.password,
      );
      const hashedPin = await this.authService.encryptSecret(
        createWorkerAccountDto.pin,
      );

      createdWorker.password = hashedPassword;
      createdWorker.pin = hashedPin;
      const worker = await createdWorker.save();
      if (!worker) throw new BadRequestException('SignUp failed.');

      const authTokenDto: AuthTokenDto = {
        _id: worker._id,
        userId: worker.userId,
        auth: worker.auth,
      };
      const token = await this.authService.createToken(authTokenDto);

      return { ...worker.toObject(), token: token };
    } catch (err) {
      handleMongooseErr(err);
    }
  }

  /**
   * Object id로 특정 worker 검색
   * @param id
   * @returns
   */
  async getWorkerById(id: Types.ObjectId): Promise<Worker> {
    return await this.workerModel.findById(id);
  }

  /**
   * option에 따른 특정 Worker 검색
   * @param option
   * @returns
   */
  async getWorkerByOption(option: Partial<WorkerFindOptions>): Promise<Worker> {
    const worker = await this.workerModel.findOne(option);

    if (!worker) {
      throw new Error("Doesn't exist");
    }
    return worker;
  }

  /**
   * Pin 검증
   * @param pinDto
   * @returns
   */
  async validateWorkerPin(pinDto: PinDto): Promise<Worker> {
    const option: Partial<WorkerFindOptions> = { userId: pinDto.userId };
    const worker = await this.workerModel.findOne(option).select('+pin');

    const verify = await this.authService.validateSecret(
      pinDto.pin,
      worker.pin,
    );
    if (!verify) {
      return null;
    }

    worker.pin = undefined;
    return worker;
  }

  /**
   * Worker 계정 업데이트 (경우에 따라서 Pin 검증을 통과한 뒤 사용)
   * @param option
   * @param updateWorkerAccountDto
   * @returns
   */
  async updateWorkerAccount(
    id: Types.ObjectId,
    updateWorkerAccountDto: UpdateWorkerAccountDto,
  ): Promise<Worker> {
    const filter = { _id: id };

    try {
      if (updateWorkerAccountDto.password) {
        const hashedPassword = await this.authService.encryptSecret(
          updateWorkerAccountDto.password,
        );
        updateWorkerAccountDto.password = hashedPassword;
      }
      if (updateWorkerAccountDto.pin) {
        const hashedPin = await this.authService.encryptSecret(
          updateWorkerAccountDto.pin,
        );
        updateWorkerAccountDto.pin = hashedPin;
      }

      return await this.workerModel.findOneAndUpdate(
        filter,
        updateWorkerAccountDto,
        { new: true },
      );
    } catch (err) {
      handleMongooseErr(err);
    }
  }

  /**
   * Worker 계정 삭제
   * @param id
   * @returns
   */
  async deleteWorkerAccountById(id: Types.ObjectId): Promise<void> {
    const filter = { _id: id };
    await this.workerModel.findOneAndDelete(filter);
    return;
  }

  /**
   * token 으로 Worker 검색
   * @param token
   * @returns
   */
  async getWorkerByToken(token: AuthTokenDto): Promise<WorkerDocument> {
    const worker = await this.workerModel.findById(token._id);
    if (!worker) {
      throw new Error("Doesn't exist.");
    }
    return worker;
  }

  /**
   * 아이디 중복 체크
   * @param userId
   * @returns
   */
  async checkWorkerDuplicate(userId: string): Promise<boolean> {
    const filter = { userId: userId };
    const result = await this.workerModel.find(filter);
    if (result.length === 0) {
      return true;
    }
    return false;
  }

  /**
   * worker 로그인
   * @param loginDto
   * @returns
   */
  async loginWorker(loginDto: LoginDto): Promise<WorkerWithToken> {
    const filter = { userId: loginDto.userId };
    const worker = await this.workerModel.findOne(filter).select('+password');
    const result = await this.authService.validateSecret(
      loginDto.password,
      worker.password,
    );
    if (worker && result) {
      const authTokenDto: AuthTokenDto = {
        _id: worker._id,
        userId: worker.userId,
        auth: worker.auth,
      };
      const token = await this.authService.createToken(authTokenDto);

      worker.password = undefined;
      return { ...worker.toObject(), token: token };
    } else {
      throw new UnauthorizedException('Login failed.');
    }
  }
}
