import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Manager } from 'src/manager/manager.schema';
import { ManagerService } from 'src/manager/manager.service';
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
    private managerService: ManagerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: AuthTokenDto): Promise<Store | Worker | Manager> {
    // Store
    if (payload.auth === Auth.STORE) {
      const store = await this.storeService.getStoreById(payload._id);
      if (!store) {
        throw new UnauthorizedException('no store');
      }
      return store;
      // Worker
    } else if (payload.auth === Auth.WORKER) {
      const worker = await this.workerService.getWorkerById(payload._id);
      if (!worker) {
        throw new UnauthorizedException();
      }
      return worker;
      // Manager
    } else if (payload.auth === Auth.MANAGER) {
      const manager = await this.managerService.getManagerById(payload._id);
      if (!manager) {
        throw new UnauthorizedException();
      }
      return manager;
    }
  }
}
