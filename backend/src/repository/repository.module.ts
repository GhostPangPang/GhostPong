import { Module } from '@nestjs/common';
import { ChatRepository } from './chat.repository';

@Module({
  providers: [ChatRepository],
  exports: [ChatRepository],
})
export class FriendModule {}
