import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { AuthTokenInfo } from 'src/auth/auth.decorator';
import { AuthTokenDto, LoginDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateManagerDto, UpdateAccountDto } from './manager.dto';
import { AccountInfo, ManagerWithToken } from './manager.model';
import { Manager } from './manager.schema';
import { ManagerService } from './manager.service';

@Controller('manager')
export class ManagerController {
  constructor(
    private managerService: ManagerService,
    private authService: AuthService,
  ) {}

  /**
   * 토큰 검증
   * @param token
   * @returns
   */
  @Post('/validate/token')
  async validateToken(
    @AuthTokenInfo() token: AuthTokenDto,
  ): Promise<ManagerWithToken> {
    const manager = await this.managerService.getManagerByToken(token);
    const token2 = await this.authService.createToken(token);
    return { ...manager.toObject(), token: token2 };
  }

  /**
   * 매니저 생성 - 개발자
   * @param createManagerDto
   * @returns
   */
  @Post('/create')
  @UsePipes(ValidationPipe)
  createManager(
    @Body() createManagerDto: CreateManagerDto,
  ): Promise<ManagerWithToken> {
    return this.managerService.createManager(createManagerDto);
  }

  /**
   * 매니저 로그인
   * @param loginDto
   * @returns
   */
  @Post('/login')
  @UsePipes(ValidationPipe)
  loginManager(@Body() loginDto: LoginDto): Promise<ManagerWithToken> {
    return this.managerService.loginManager(loginDto);
  }

  /**
   * 입금 계좌 수정
   * @param id
   * @param updateAccountDto
   * @returns
   */
  @Patch('/update/account/:id')
  @UsePipes(ValidationPipe)
  updateAccount(
    @Param('id') id: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Manager> {
    return this.managerService.updateAccount(id, updateAccountDto);
  }

  /**
   * 매니저 입금 계좌 정보 받기
   * @returns
   */
  @Get('/account')
  getManagerAccount(): Promise<AccountInfo> {
    return this.managerService.getManagerAccount();
  }
}
