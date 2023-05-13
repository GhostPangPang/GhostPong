import { Module } from '@nestjs/common';

import { ChannelRepository } from './channel.repository';
import { SocketIdRepository } from './socket-id.repository';
import { UserStatusRepository } from './user-status.repository';

@Module({
  providers: [ChannelRepository, UserStatusRepository, SocketIdRepository],
  exports: [ChannelRepository, UserStatusRepository, SocketIdRepository],
})
export class RepositoryModule {}
