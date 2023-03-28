import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Store } from 'src/store/store.schema';
import { StoreService } from 'src/store/store.service';
import { Worker } from 'src/worker/worker.schema';
import { WorkerService } from 'src/worker/worker.service';
import { Auth } from '../auth.constants';
import { AuthTokenDto } from '../auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private storeService: StoreService,
    private workerService: WorkerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: AuthTokenDto): Promise<Store | Worker> {
    const filter = { _id: payload._id };
    if (payload.auth === Auth.STORE) {
      const store = await this.storeService.getStoreByOption(filter);
      if (!store) {
        throw new UnauthorizedException('no store');
      }
      return store;
    } else if (payload.auth === Auth.WORKER) {
      const worker = await this.workerService.getWorkerByOption(filter);
      if (!worker) {
        throw new UnauthorizedException();
      }
      return worker;
    }
  }
}
