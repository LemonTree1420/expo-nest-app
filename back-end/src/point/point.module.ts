import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Point, PointSchema } from './point.schema';
import { PointController } from './point.controller';
import { PointService } from './point.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Point.name, schema: PointSchema }]),
  ],
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
