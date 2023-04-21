import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friendship } from '../entity/friendship.entity';
import { Message } from '../entity/message.entity';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Message])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
