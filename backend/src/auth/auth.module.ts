import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from '../entity/auth.entity';
import { User } from '../entity/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  // 사용할 entity
  imports: [TypeOrmModule.forFeature([Auth, User])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
