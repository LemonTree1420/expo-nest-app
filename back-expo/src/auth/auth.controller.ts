import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuth } from 'src/constants/auth.constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign')
  async signInGoogle(
    @Body() auth: GoogleAuth,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.getGoogleInfo(auth, res);
    await this.authService.signInGoogle(user);
    return await this.authService.injectAuthToken(user);
  }

  @Get('test')
  @UseGuards(AuthGuard())
  async test() {
    console.log('인증통과!');
  }
}
