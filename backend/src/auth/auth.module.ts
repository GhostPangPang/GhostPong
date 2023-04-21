import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from '../entity/auth.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtOAuthStrategy } from './strategy/ft-oauth.strategy';

@Module({
  // 사용할 entity
  imports: [TypeOrmModule.forFeature([Auth])],
  providers: [AuthService, FtOAuthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
