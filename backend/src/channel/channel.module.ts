import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entity/user.entity';
import { RepositoryModule } from '../repository/repository.module';

import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [RepositoryModule, TypeOrmModule.forFeature([User])],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
