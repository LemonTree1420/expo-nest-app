import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { StoreController } from './store.controller';
import { Store, StoreSchema } from './store.schema';
import { StoreService } from './store.service';
import { ManagerService } from 'src/manager/manager.service';
import { Manager, ManagerSchema } from 'src/manager/manager.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: Manager.name, schema: ManagerSchema },
    ]),
  ],
  controllers: [StoreController],
  providers: [StoreService, AuthService, ManagerService],
})
export class StoreModule {}
