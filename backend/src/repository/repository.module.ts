import { Module } from '@nestjs/common';

import { InvisibleChannelRepository } from './invisible-channel.repository';
import { SocketIdRepository } from './socket-id.repository';
import { UserStatusRepository } from './user-status.repository';
import { VisibleChannelRepository } from './visible-channel.repository';

@Module({
  providers: [VisibleChannelRepository, UserStatusRepository, SocketIdRepository, InvisibleChannelRepository],
  exports: [VisibleChannelRepository, UserStatusRepository, SocketIdRepository, InvisibleChannelRepository],
})
export class RepositoryModule {}
