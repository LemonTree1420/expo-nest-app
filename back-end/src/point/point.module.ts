import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Point, PointSchema } from './point.schema';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { StoreService } from 'src/store/store.service';
import { WorkerService } from 'src/worker/worker.service';
import { Store, StoreSchema } from 'src/store/store.schema';
import { Worker, WorkerSchema } from 'src/worker/worker.schema';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Point.name, schema: PointSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Worker.name, schema: WorkerSchema },
    ]),
  ],
  controllers: [PointController],
  providers: [PointService, AuthService, StoreService, WorkerService],
})
export class PointModule {}
