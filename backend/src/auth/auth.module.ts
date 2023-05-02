import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FtAuthConfigModule } from '../config/auth/ft/configuration.module';
import { JwtConfigModule } from '../config/auth/jwt/configuration.module';
import { Auth } from '../entity/auth.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategy/auth.strategy';
import { FtOAuthStrategy } from './strategy/ft-oauth.strategy';
import { UserStrategy } from './strategy/user.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), JwtModule.register({}), FtAuthConfigModule, JwtConfigModule],
  providers: [AuthService, FtOAuthStrategy, AuthStrategy, UserStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
