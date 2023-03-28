import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { StoreController } from './store.controller';
import { Store, StoreSchema } from './store.schema';
import { StoreService } from './store.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [StoreController],
  providers: [StoreService, AuthService],
})
export class StoreModule {}
