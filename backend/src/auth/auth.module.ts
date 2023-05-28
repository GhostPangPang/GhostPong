import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { TWO_FA_EXPIRES_IN, TWO_FA_MAX } from '../common/constant';
import { AppConfigModule } from '../config/app/configuration.module';
import { FtAuthConfigModule } from '../config/auth/ft/configuration.module';
import { JwtConfigModule } from '../config/auth/jwt/configuration.module';
import { MailerConfigModule } from '../config/auth/mailer/configuration.module';
import { MailerConfigService } from '../config/auth/mailer/configuration.service';
import { Auth } from '../entity/auth.entity';
import { User } from '../entity/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserGuard } from './guard/user.guard';
import { FtStrategy } from './strategy/ft.strategy';
import { UserStrategy } from './strategy/user.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User]),
    JwtModule.register({}),
    FtAuthConfigModule,
    JwtConfigModule,
    MailerConfigModule,
    AppConfigModule,
    CacheModule.register({
      store: 'memory',
      ttl: TWO_FA_EXPIRES_IN,
      max: TWO_FA_MAX,
    }),
    MailerModule.forRootAsync({
      imports: [MailerConfigModule],
      useFactory: (mailerConfigService: MailerConfigService) => mailerConfigService.mailerOptions,
      inject: [MailerConfigService],
    }),
  ],
  providers: [AuthService, FtStrategy, UserStrategy, UserGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
