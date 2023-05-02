import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockedUser } from '../entity/blocked-user.entity';
import { Friendship } from '../entity/friendship.entity';
import { MessageView } from '../entity/message-view.entity';
import { User } from '../entity/user.entity';

import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, BlockedUser, MessageView, User])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
