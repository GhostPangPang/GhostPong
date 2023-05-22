import { Module } from '@nestjs/common';

import { ChannelRepository } from './channel.repository';
import { GameRepository } from './game.repository';
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
    ChannelRepository,
    GameRepository,
  ],
  exports: [
    VisibleChannelRepository,
    UserStatusRepository,
    SocketIdRepository,
    InvisibleChannelRepository,
    InvitationRepository,
    ChannelRepository,
    GameRepository,
  ],
})
export class RepositoryModule {}
