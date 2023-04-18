import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';

import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUser, User])],
  controllers: [BlockedController],
  providers: [BlockedService, UserService],
})
export class BlockedModule {}
