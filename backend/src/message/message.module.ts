import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friendship } from '../entity/friendship.entity';
import { MessageView } from '../entity/message-view.entity';
import { Message } from '../entity/message.entity';
import { RepositoryModule } from '../repository/repository.module';

import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Message, MessageView]), RepositoryModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageGateway],
})
export class MessageModule {}
