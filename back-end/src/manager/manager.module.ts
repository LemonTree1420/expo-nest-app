import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ManagerController } from './manager.controller';
import { Manager, ManagerSchema } from './manager.schema';
import { ManagerService } from './manager.service';
import { StoreService } from 'src/store/store.service';
import { WorkerService } from 'src/worker/worker.service';
import { AuthModule } from 'src/auth/auth.module';
import { Store, StoreSchema } from 'src/store/store.schema';
import { Worker, WorkerSchema } from 'src/worker/worker.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Manager.name, schema: ManagerSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Worker.name, schema: WorkerSchema },
    ]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService, StoreService, WorkerService, AuthService],
})
export class ManagerModule {}
