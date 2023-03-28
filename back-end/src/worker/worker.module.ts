import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { WorkerController } from './worker.controller';
import { Worker, WorkerSchema } from './worker.schema';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService, AuthService],
})
export class WorkerModule {}
