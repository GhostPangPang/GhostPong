import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TWO_FACTOR_AUTH_EXPIREIN } from '../common/constant';
import { AppConfigModule } from '../config/app/configuration.module';
import { FtAuthConfigModule } from '../config/auth/ft/configuration.module';
import { JwtConfigModule } from '../config/auth/jwt/configuration.module';
import { Auth } from '../entity/auth.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserGuard } from './guard/user.guard';
import { FtStrategy } from './strategy/ft.strategy';
import { GuestStrategy } from './strategy/guest.strategy';
import { UserStrategy } from './strategy/user.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({}),
    FtAuthConfigModule,
    JwtConfigModule,
    AppConfigModule,
    CacheModule.register({
      store: 'memory',
      ttl: TWO_FACTOR_AUTH_EXPIREIN,
    }),
  ],
  providers: [AuthService, FtStrategy, GuestStrategy, UserStrategy, UserGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
