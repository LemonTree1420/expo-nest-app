import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Store, StoreSchema } from 'src/store/store.schema';
import { StoreService } from 'src/store/store.service';
import { Worker, WorkerSchema } from 'src/worker/worker.schema';
import { WorkerService } from 'src/worker/worker.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: Worker.name, schema: WorkerSchema },
    ]),
    {
      ...JwtModule.register({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '1d' },
      }),
      global: true,
    },
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy, AuthService, StoreService, WorkerService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
