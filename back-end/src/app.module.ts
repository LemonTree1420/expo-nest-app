import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CallModule } from './call/call.module';
import { PointModule } from './point/point.module';
import { StoreModule } from './store/store.module';
import { WorkerModule } from './worker/worker.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI, {
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
    }),
    StoreModule,
    CallModule,
    WorkerModule,
    AuthModule,
    PointModule,
  ],
})
export class AppModule {}
