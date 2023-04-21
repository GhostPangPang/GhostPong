import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friendship } from '../entity/friendship.entity';
import { MessageView } from '../entity/message-view.entity';
import { User } from '../entity/user.entity';
import { UserModule } from '../user/user.module';

import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User, MessageView]), UserModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
