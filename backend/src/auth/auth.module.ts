import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from '../entity/auth.entity';
import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  // 사용할 entity
  imports: [TypeOrmModule.forFeature([Auth, User, BlockedUser])],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
