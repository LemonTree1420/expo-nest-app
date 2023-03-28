import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthTokenDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  /**
   * 비밀번호 암호화
   * @param password
   * @returns
   */
  async encryptSecret(secret: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(secret, salt);
  }

  /**
   * 암호 일치 여부 (password, pin)
   * @param inputSecret
   * @param originalSecret
   * @returns
   */
  async validateSecret(
    inputSecret: string,
    originalSecret: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputSecret, originalSecret);
  }

  /**
   * 토큰 생성
   * @param data
   * @returns
   */
  async createToken(data: AuthTokenDto): Promise<string> {
    const payload = {
      _id: data._id,
      userId: data.userId,
      auth: data.auth,
    };
    return this.jwtService.sign(payload);
  }
}
