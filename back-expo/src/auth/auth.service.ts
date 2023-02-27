import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, firstValueFrom, map } from 'rxjs';
import {
  AuthToken,
  GoogleAuth,
  GoogleProfile,
} from 'src/constants/auth.constants';
import { TestDB } from 'src/constants/db.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async getGoogleInfo(auth: GoogleAuth, res: Response) {
    const result = await firstValueFrom(
      this.httpService
        .get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            throw new BadRequestException();
          }),
        ),
    );
    if (!result) throw new BadRequestException();

    return result;
  }

  async signInGoogle(data: GoogleProfile) {
    // db 생성되면 해당 정보 찾아서
    // 없으면 저장 후 return data
    // 있으면 그냥 return data 로직 필요
    const user = TestDB.find(
      (el) => el.email === data.email && el.name === data.name,
    );
    console.log('user :', user);

    return user;
  }

  async injectAuthToken(user: GoogleProfile) {
    const token: AuthToken = {
      email: user.email,
      name: user.name,
      picture: user.picture,
    };
    const signedToken = this.jwtService.sign(token);
    return signedToken;
  }

  async tokenValidateUser(payload: any) {
    // db 생성되면 해당 토큰으로 찾는 로직 필요
    return TestDB.find(
      (el) => el.email === payload.email && el.name === payload.name,
    );
  }
}
