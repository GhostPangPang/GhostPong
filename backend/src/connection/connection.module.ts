import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../config/app/configuration.module';
import { Friendship } from '../entity/friendship.entity';
import { RepositoryModule } from '../repository/repository.module';

import { ConnectionGateway } from './connection.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship]), RepositoryModule, AppConfigModule, JwtModule.register({})],
  providers: [ConnectionGateway],
  exports: [ConnectionGateway],
})
export class ConnectionModule {}
