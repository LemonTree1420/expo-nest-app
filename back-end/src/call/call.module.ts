import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Store, StoreSchema } from 'src/store/store.schema';
import { StoreService } from 'src/store/store.service';
import { Worker, WorkerSchema } from 'src/worker/worker.schema';
import { WorkerService } from 'src/worker/worker.service';
import { CallController } from './call.controller';
import { Call, CallSchema } from './call.schema';
import { CallService } from './call.service';
import { ManagerService } from 'src/manager/manager.service';
import { Manager, ManagerSchema } from 'src/manager/manager.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Call.name, schema: CallSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: Manager.name, schema: ManagerSchema },
    ]),
  ],
  controllers: [CallController],
  providers: [
    CallService,
    StoreService,
    WorkerService,
    AuthService,
    ManagerService,
  ],
})
export class CallModule {}
