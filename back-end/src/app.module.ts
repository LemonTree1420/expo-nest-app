import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreModule } from './store/store.module';
import { CallModule } from './call/call.module';
import { WorkerModule } from './worker/worker.module';
import { AuthModule } from './auth/auth.module';
import { PointModule } from './point/point.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
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
