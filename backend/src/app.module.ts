import { join } from 'path';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AchievementModule } from './achievement/achievement.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserGuard } from './auth/guard/user.guard';
import { BlockedModule } from './blocked/blocked.module';
import { ChannelModule } from './channel/channel.module';
import { AppConfigModule } from './config/app/configuration.module';
import { DatabaseConfigModule } from './config/database/configuration.module';
import { DatabaseConfigService } from './config/database/configuration.service';
import { ConnectionModule } from './connection/connection.module';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useClass: DatabaseConfigService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
      renderPath: '/image',
      serveStaticOptions: { index: false, redirect: false },
    }),
    FriendModule,
    UserModule,
    AuthModule,
    BlockedModule,
    FriendModule,
    MessageModule,
    ChannelModule,
    ConnectionModule,
    GameModule,
    AchievementModule,
  ],
  providers: [AppService, { provide: APP_GUARD, useClass: UserGuard }],
})
export class AppModule {}
