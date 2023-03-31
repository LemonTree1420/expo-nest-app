import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import {
  CreateWorkerAccountDto,
  UpdateWorkerAccountDto,
  WorkerFindOptions,
} from './worker.dto';
import { WorkerWithToken } from './worker.model';
import { Worker } from './worker.schema';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
  constructor(
    private workerService: WorkerService,
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
  ): Promise<WorkerWithToken> {
    const worker = await this.workerService.getWorkerByToken(token);
    const token2 = await this.authService.createToken(token);
    logging(worker.userId, Process.CONTROLLER, 'validateToken');
    return { ...worker.toObject(), token: token2 };
  }

  /**
   * 계정 생성
   * @param createWorkerAccountDto
   * @returns
   */
  @Post('/register')
  @UsePipes(ValidationPipe)
  createWorkerAccount(
    @Body() createWorkerAccountDto: CreateWorkerAccountDto,
  ): Promise<WorkerWithToken> {
    return this.workerService.createWorkerAccount(createWorkerAccountDto);
  }

  /**
   * 아이디 찾기
   * @param id
   * @returns
   */
  @Get('/find/account/:id')
  async findUserIdByCellPhoneNumber(
    @Param('id') cellPhoneNumber: string,
  ): Promise<Worker> {
    const filter = { cellPhoneNumber: cellPhoneNumber };
    return await this.workerService.getWorkerByOption(filter);
  }

  /**
   * Pin 검증
   * @param pinDto
   * @returns
   */
  @Post('/validate/pin')
  @UsePipes(ValidationPipe)
  validateWorkerPin(@Body() pinDto: PinDto): Promise<Worker> {
    return this.workerService.validateWorkerPin(pinDto);
  }

  /**
   * 계정 정보 수정
   * @param id
   * @param updateWorkerAccountDto
   * @returns
   */
  @Patch('/update/:id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  updateWorkerAccount(
    @Param('id') id: Types.ObjectId,
    @Body() updateWorkerAccountDto: UpdateWorkerAccountDto,
  ): Promise<Worker> {
    return this.workerService.updateWorkerAccount(id, updateWorkerAccountDto);
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
    @Body() updateWorkerAccountDto: UpdateWorkerAccountDto,
  ): Promise<Worker> {
    return this.workerService.updateWorkerAccount(id, updateWorkerAccountDto);
  }

  /**
   * 계정 삭제
   * @param id
   * @returns
   */
  @Delete('/delete/:id')
  deleteWorkerAccountById(@Param('id') id: Types.ObjectId): Promise<void> {
    return this.workerService.deleteWorkerAccountById(id);
  }

  /**
   * 아이디 중복 체크
   * @param userId
   * @returns
   */
  @Get('/duplicate/:id')
  checkWorkerDuplicate(@Param('id') userId: string): Promise<boolean> {
    return this.workerService.checkWorkerDuplicate(userId);
  }

  /**
   * 로그인
   * @param loginDto
   * @returns
   */
  @Post('/login')
  @UsePipes(ValidationPipe)
  loginStore(@Body() loginDto: LoginDto): Promise<WorkerWithToken> {
    return this.workerService.loginWorker(loginDto);
  }

  @Post('test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }

  /**
   * Object Id로 특정 Worker 검색
   * @param id
   * @returns
   */
  @Get('/search/:id')
  @UseGuards(AuthGuard())
  async searchWorkerById(@Param('id') id: Types.ObjectId): Promise<Worker> {
    return await this.workerService.getWorkerById(id);
  }
}
