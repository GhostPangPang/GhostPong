import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '../auth/auth.service';
import { Auth } from '../entity/auth.entity';
import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlockedUser, Auth])],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
