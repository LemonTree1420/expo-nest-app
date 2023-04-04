import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthTokenDto, LoginDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateManagerDto, UpdateAccountDto } from './manager.dto';
import { AccountInfo, ManagerWithToken } from './manager.model';
import { Manager, ManagerDocument } from './manager.schema';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(Manager.name) private managerModel: Model<ManagerDocument>,
    private readonly authService: AuthService,
  ) {}

  /**
   * 매니저 생성 - 개발자
   * @param createManagerDto
   * @returns
   */
  async createManager(
    createManagerDto: CreateManagerDto,
  ): Promise<ManagerWithToken> {
    const createdManager = new this.managerModel(createManagerDto);

    const hashedPassword = await this.authService.encryptSecret(
      createManagerDto.password,
    );
    createdManager.password = hashedPassword;
    const hashedPin = await this.authService.encryptSecret(
      createManagerDto.pin,
    );
    createdManager.pin = hashedPin;

    const manager = await createdManager.save();
    if (!manager) {
      throw new BadRequestException('Fail to create manager.');
    }

    const authTokenDto: AuthTokenDto = {
      _id: manager._id,
      userId: manager.userId,
      auth: manager.auth,
    };
    const token = await this.authService.createToken(authTokenDto);
    return { ...manager.toObject(), token: token };
  }

  /**
   * Object id로 manager 검색 - jwt strategy ...
   * @param id
   * @returns
   */
  async getManagerById(id: Types.ObjectId): Promise<Manager> {
    const manager = await this.managerModel.findById(id);
    if (!manager) {
      throw new Error("Doesn't exist.");
    }
    return manager;
  }

  /**
   * token으로 manager 검색 - validate token
   * @param token
   * @returns
   */
  async getManagerByToken(token: AuthTokenDto): Promise<ManagerDocument> {
    const manager = await this.managerModel.findById(token._id);
    if (!manager) {
      throw new Error("Doesn't exist.");
    }
    return manager;
  }

  /**
   * userId로 manager 검색 - Store, Worker 회원가입 시.
   * @param userId
   * @returns
   */
  async getManagerByUserId(userId: string): Promise<Manager> {
    const filter = { userId: userId };
    const manager = await this.managerModel.findOne(filter);
    if (!manager) {
      throw new Error("Doesn't exist.");
    }
    return manager;
  }

  /**
   * 매니저 로그인
   * @param loginDto
   * @returns
   */
  async loginManager(loginDto: LoginDto): Promise<ManagerWithToken> {
    const filter = { userId: loginDto.userId };
    const manager = await this.managerModel.findOne(filter).select('+password');
    if (!manager) {
      throw new Error('Does not exist the manager');
    }

    const result = await this.authService.validateSecret(
      loginDto.password,
      manager.password,
    );
    if (!result) {
      throw new Error('Password was wrong.');
    }

    const authTokenDto: AuthTokenDto = {
      _id: manager._id,
      userId: manager.userId,
      auth: manager.auth,
    };
    const token = await this.authService.createToken(authTokenDto);
    manager.password = undefined;
    return { ...manager.toObject(), token: token };
  }

  /**
   * 입금 계좌 변경
   * @param id
   * @param updateAccountDto
   * @returns
   */
  async updateAccount(
    id: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Manager> {
    const filter = { _id: id };
    return await this.managerModel.findOneAndUpdate(filter, updateAccountDto, {
      new: true,
    });
  }

  /**
   * 매니저 입금 계좌 정보 받기
   * @returns
   */
  async getManagerAccount(): Promise<AccountInfo> {
    const manager: AccountInfo = await this.managerModel.findOne();
    const accountInfo = {
      bank: manager.bank,
      accountHolder: manager.accountHolder,
      accountNumber: manager.accountNumber,
    };
    return accountInfo;
  }
}
