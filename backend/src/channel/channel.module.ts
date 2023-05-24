import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MUTE_EXPIRES_IN } from '../common/constant';
import { ConnectionModule } from '../connection/connection.module';
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';
import { RepositoryModule } from '../repository/repository.module';

import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    RepositoryModule,
    TypeOrmModule.forFeature([User, Friendship]),
    CacheModule.register({ store: 'memory', ttl: MUTE_EXPIRES_IN }),
    ConnectionModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
})
export class ChannelModule {}
