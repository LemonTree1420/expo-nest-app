import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthTokenDto, LoginDto, PinDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { handleMongooseErr } from 'src/constants/handleErr';
import {
  CreateStoreAccountDto,
  StoreFindOptions,
  UpdateStoreAccountDto,
} from './store.dto';
import { StoreWithToken } from './store.model';
import { Store, StoreDocument } from './store.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Store 계정 생성
   * @param createStoreAccountDto
   * @returns
   */
  async createStoreAccount(
    createStoreAccountDto: CreateStoreAccountDto,
  ): Promise<StoreWithToken> {
    try {
      const createdStore = new this.storeModel(createStoreAccountDto);

      const hashedPassword = await this.authService.encryptSecret(
        createStoreAccountDto.password,
      );
      const hashedPin = await this.authService.encryptSecret(
        createStoreAccountDto.pin,
      );

      createdStore.password = hashedPassword;
      createdStore.pin = hashedPin;

      const store = await createdStore.save();
      if (!store) throw new BadRequestException('SignUp Failed');

      const authTokenDto: AuthTokenDto = {
        _id: store._id,
        userId: store.userId,
        auth: store.auth,
      };
      const token = await this.authService.createToken(authTokenDto);
      return { ...store.toObject(), token: token };
    } catch (err) {
      handleMongooseErr(err);
    }
  }

  /**
   * Object id로 특정 Store 검색
   * @param id
   * @returns
   */
  async getStoreById(id: Types.ObjectId): Promise<Store> {
    return await this.storeModel.findById(id);
  }

  /**
   * option에 따른 특정 Store 검색
   * @param option
   * @returns
   */
  async getStoreByOption(option: Partial<StoreFindOptions>): Promise<Store> {
    const store = await this.storeModel.findOne(option);
    if (!store) {
      throw new Error("Doesn't exist");
    }
    return store;
  }

  /**
   * Pin 검증
   * @param pinDto
   * @returns
   */
  async validateStorePin(pinDto: PinDto): Promise<Store> {
    const option: Partial<StoreFindOptions> = { userId: pinDto.userId };
    const store = await this.storeModel.findOne(option).select('+pin');

    const verify = await this.authService.validateSecret(pinDto.pin, store.pin);
    if (!verify) {
      return null;
    }

    store.pin = undefined;
    return store;
  }

  /**
   * Store 계정 업데이트 (경우에 따라서 Pin 검증을 통과한 뒤 사용)
   * @param option
   * @param updateStoreAccountDto
   * @returns
   */
  async updateStoreAccount(
    id: string,
    updateStoreAccountDto: UpdateStoreAccountDto,
  ): Promise<Store> {
    const filter = { _id: id };

    if (updateStoreAccountDto.password) {
      const hashedPassword = await this.authService.encryptSecret(
        updateStoreAccountDto.password,
      );
      updateStoreAccountDto.password = hashedPassword;
    }
    if (updateStoreAccountDto.pin) {
      const hashedPin = await this.authService.encryptSecret(
        updateStoreAccountDto.pin,
      );
      updateStoreAccountDto.pin = hashedPin;
    }

    return await this.storeModel.findOneAndUpdate(
      filter,
      updateStoreAccountDto,
      { new: true },
    );
  }

  /**
   * Store 계정 삭제
   * @param id
   * @returns
   */
  async deleteStoreAccountById(id: string): Promise<void> {
    const filter = { _id: id };
    await this.storeModel.findOneAndDelete(filter);
    return;
  }

  /**
   * token 으로 Store 검색
   * @param token
   * @returns
   */
  async getStoreByToken(token: AuthTokenDto): Promise<StoreDocument> {
    const store = await this.storeModel.findById(token._id);
    if (!store) {
      throw new Error("Doesn't exist.");
    }
    return store;
  }

  /**
   * 아이디 중복 체크
   * @param userId
   * @returns
   */
  async checkStoreDuplicate(userId: string): Promise<boolean> {
    const filter = { userId: userId };
    const result = await this.storeModel.find(filter);
    if (result.length === 0) {
      return true;
    }
    return false;
  }

  /**
   * store 로그인
   * @param loginDto
   * @returns
   */
  async loginStore(loginDto: LoginDto): Promise<StoreWithToken> {
    const filter = { userId: loginDto.userId };
    const store = await this.storeModel.findOne(filter).select('+password');

    const result = await this.authService.validateSecret(
      loginDto.password,
      store.password,
    );
    if (store && result) {
      const authTokenDto: AuthTokenDto = {
        _id: store._id,
        userId: store.userId,
        auth: store.auth,
      };
      const token = await this.authService.createToken(authTokenDto);

      store.password = undefined;
      return { ...store.toObject(), token: token };
    } else {
      throw new UnauthorizedException('Login failed.');
    }
  }
}
