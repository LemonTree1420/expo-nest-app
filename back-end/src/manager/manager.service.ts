import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthTokenDto, LoginDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateManagerDto } from './manager.dto';
import { ManagerWithToken } from './manager.model';
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
    const createdManager = await new this.managerModel(createManagerDto);

    const hashedPassword = await this.authService.encryptSecret(
      createManagerDto.password,
    );
    createdManager.password = hashedPassword;

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
    return { ...manager, token: token };
  }

  /**
   * Object id로 manager 검색 - jwt strategy ...
   * @param id
   * @returns
   */
  async getManagerById(id: Types.ObjectId): Promise<Manager> {
    return await this.managerModel.findById(id);
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
    return { ...manager, token: token };
  }
}
