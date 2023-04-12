import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from '../entity/auth.entity';
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';

import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Auth, User])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
