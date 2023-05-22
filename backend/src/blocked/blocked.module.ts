import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';
import { FriendModule } from '../friend/friend.module';

import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUser, User]), FriendModule],
  controllers: [BlockedController],
  providers: [BlockedService],
  exports: [BlockedService],
})
export class BlockedModule {}
