import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { WorkerController } from './worker.controller';
import { Worker, WorkerSchema } from './worker.schema';
import { WorkerService } from './worker.service';
import { ManagerService } from 'src/manager/manager.service';
import { Manager, ManagerSchema } from 'src/manager/manager.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Worker.name, schema: WorkerSchema },
      { name: Manager.name, schema: ManagerSchema },
    ]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService, AuthService, ManagerService],
})
export class WorkerModule {}
