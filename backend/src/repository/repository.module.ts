import { Module } from '@nestjs/common';

import { ChatRepository } from './chat.repository';
import { SocketIdRepository } from './socket-id.repository';
import { UserStatusRepository } from './user-status.repository';

@Module({
  providers: [ChatRepository, UserStatusRepository, SocketIdRepository],
  exports: [ChatRepository, UserStatusRepository, SocketIdRepository],
})
export class RepositoryModule {}
