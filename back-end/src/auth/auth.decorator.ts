import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthTokenDto } from './auth.dto';

export const AuthTokenInfo = createParamDecorator(
  (data, ctx: ExecutionContext): AuthTokenDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
