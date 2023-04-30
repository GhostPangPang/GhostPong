import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from 'src/app.module';
import { AppConfigService } from 'src/config/app/configuration.service';

import { FtAuthConfigModule } from '../config/auth/ft/configuration.module';
import { JwtConfigModule } from '../config/auth/jwt/configuration.module';
import { JwtConfigService } from '../config/auth/jwt/configuration.service';
import { Auth } from '../entity/auth.entity';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategy/auth.strategy';
import { FtOAuthStrategy } from './strategy/ft-oauth.strategy';
import { UserStrategy } from './strategy/user.strategy';

@Module({
  // 사용할 entity
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({}),
    FtAuthConfigModule,
    forwardRef(() => AppModule),
    forwardRef(() => JwtConfigModule),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, FtOAuthStrategy, AuthStrategy, UserStrategy, AppConfigService, JwtConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
