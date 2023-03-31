import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ManagerController } from './manager.controller';
import { Manager, ManagerSchema } from './manager.schema';
import { ManagerService } from './manager.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manager.name, schema: ManagerSchema }]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService, AuthService],
})
export class ManagerModule {}
