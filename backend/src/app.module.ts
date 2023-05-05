import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlockedModule } from './blocked/blocked.module';
import { AppConfigModule } from './config/app/configuration.module';
import { DatabaseConfigModule } from './config/database/configuration.module';
import { DatabaseConfigService } from './config/database/configuration.service';
import { FriendModule } from './friend/friend.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './auth/guard/user.guard';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useClass: DatabaseConfigService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      renderPath: '/asset',
      serveStaticOptions: { index: false, redirect: false },
    }),
    FriendModule,
    UserModule,
    AuthModule,
    BlockedModule,
    FriendModule,
    MessageModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: UserGuard }],
})
export class AppModule {}
