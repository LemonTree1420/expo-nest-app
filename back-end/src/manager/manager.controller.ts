import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthTokenInfo } from 'src/auth/auth.decorator';
import { AuthTokenDto, LoginDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateManagerDto } from './manager.dto';
import { ManagerWithToken } from './manager.model';
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
    const manager = await this.managerService.getManagerById(token._id);
    const token2 = await this.authService.createToken(token);
    return { ...manager, token: token2 };
  }

  /**
   * 매니저 생성 - 개발자
   * @param createManagerDto
   * @returns
   */
  @Post('/create')
  @UsePipes(ValidationPipe)
  createManager(createManagerDto: CreateManagerDto): Promise<ManagerWithToken> {
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
}
