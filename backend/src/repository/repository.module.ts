import { Module } from '@nestjs/common';

import { ChatRepository } from './chat.repository';
import { UserStatusRepository } from './user-status.repository';

@Module({
  providers: [ChatRepository, UserStatusRepository],
  exports: [ChatRepository, UserStatusRepository],
})
export class RepositoryModule {}
