import { Module } from '@nestjs/common';

import { ChannelRepository } from './channel.repository';
import { PrivateChannelRepository } from './private-channel.repository';
import { SocketIdRepository } from './socket-id.repository';
import { UserStatusRepository } from './user-status.repository';

@Module({
  providers: [ChannelRepository, UserStatusRepository, SocketIdRepository, PrivateChannelRepository],
  exports: [ChannelRepository, UserStatusRepository, SocketIdRepository, PrivateChannelRepository],
})
export class RepositoryModule {}
