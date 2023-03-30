import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { AuthTokenInfo } from 'src/auth/auth.decorator';
import { AuthTokenDto, LoginDto, PinDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { logging, Process } from 'src/logger';
import { CreateStoreAccountDto, UpdateStoreAccountDto } from './store.dto';
import { StoreWithToken } from './store.model';
import { Store } from './store.schema';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(
    private storeService: StoreService,
    private authService: AuthService,
  ) {}

  /**
   * 토큰 검증 (guard와는 다름)
   * 어플 실행 때마다 토큰 여부 체크하는 api
   * @param token
   * @returns
   */
  @Post('/validate/token')
  @UseGuards(AuthGuard())
  async validateToken(
    @AuthTokenInfo() token: AuthTokenDto,
  ): Promise<StoreWithToken> {
    const store = await this.storeService.getStoreByToken(token);
    const token2 = await this.authService.createToken(token);
    logging(store.userId, Process.CONTROLLER, 'validateToken');
    return { ...store.toObject(), token: token2 };
  }

  /**
   * 계정 생성
   * @param createStoreAccountDto
   * @returns
   */
  @Post('/register')
  @UsePipes(ValidationPipe)
  createStoreAccount(
    @Body() createStoreAccountDto: CreateStoreAccountDto,
  ): Promise<StoreWithToken> {
    return this.storeService.createStoreAccount(createStoreAccountDto);
  }

  /**
   * 아이디 찾기
   * @param id
   * @returns
   */
  @Get('/find/account/:id')
  async findUserIdByCellPhoneNumber(
    @Param('id') cellPhoneNumber: string,
  ): Promise<Store> {
    const filter = { cellPhoneNumber: cellPhoneNumber };
    return await this.storeService.getStoreByOption(filter);
  }

  /**
   * Pin 검증
   * @param pinDto
   * @returns
   */
  @Post('/validate/pin')
  @UsePipes(ValidationPipe)
  validateStorePin(@Body() pinDto: PinDto): Promise<Store> {
    return this.storeService.validateStorePin(pinDto);
  }

  /**
   * 계정 정보 수정
   * @param id
   * @param updateStoreAccountDto
   * @returns
   */
  @Patch('/update/:id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  updateStoreAccount(
    @Param('id') id: Types.ObjectId,
    @Body() updateStoreAccountDto: UpdateStoreAccountDto,
  ): Promise<Store> {
    return this.storeService.updateStoreAccount(id, updateStoreAccountDto);
  }

  /**
   * 비밀번호 수정
   * @param id
   * @param updateStoreAccountDto
   * @returns
   */
  @Patch('/update/password/:id')
  @UsePipes(ValidationPipe)
  updateStorePassword(
    @Param('id') id: Types.ObjectId,
    @Body() updateStoreAccountDto: UpdateStoreAccountDto,
  ): Promise<Store> {
    return this.storeService.updateStoreAccount(id, updateStoreAccountDto);
  }

  /**
   * 계정 삭제
   * @param id
   * @returns
   */
  @Delete('/delete/:id')
  deleteStoreAccountById(@Param('id') id: Types.ObjectId): Promise<void> {
    return this.storeService.deleteStoreAccountById(id);
  }

  /**
   * 아이디 중복 체크
   * @param userId
   * @returns
   */
  @Get('/duplicate/:id')
  checkStoreDuplicate(@Param('id') userId: string): Promise<boolean> {
    return this.storeService.checkStoreDuplicate(userId);
  }

  /**
   * 로그인
   * @param loginDto
   * @returns
   */
  @Post('/login')
  @UsePipes(ValidationPipe)
  loginStore(@Body() loginDto: LoginDto): Promise<StoreWithToken> {
    return this.storeService.loginStore(loginDto);
  }
}
