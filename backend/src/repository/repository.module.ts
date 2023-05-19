import { Module } from '@nestjs/common';

import { InvisibleChannelRepository } from './invisible-channel.repository';
import { InvitationRepository } from './invitation.repository';
import { SocketIdRepository } from './socket-id.repository';
import { UserStatusRepository } from './user-status.repository';
import { VisibleChannelRepository } from './visible-channel.repository';

@Module({
  providers: [
    VisibleChannelRepository,
    UserStatusRepository,
    SocketIdRepository,
    InvisibleChannelRepository,
    InvitationRepository,
  ],
  exports: [
    VisibleChannelRepository,
    UserStatusRepository,
    SocketIdRepository,
    InvisibleChannelRepository,
    InvitationRepository,
  ],
})
export class RepositoryModule {}
