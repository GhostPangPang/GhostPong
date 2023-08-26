import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TWO_FA_EXPIRES_IN, TWO_FA_MAX } from '../common/constant';
import { AppConfigModule } from '../config/app/configuration.module';
import { FtAuthConfigModule } from '../config/auth/ft/configuration.module';
import { GithubAuthConfigModule } from '../config/auth/github/configuration.module';
import { GoogleAuthConfigModule } from '../config/auth/google/configuration.module';
import { JwtConfigModule } from '../config/auth/jwt/configuration.module';
import { Auth } from '../entity/auth.entity';
import { User } from '../entity/user.entity';
import { MailerModule } from '../mailer/mailer.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserGuard } from './guard/user.guard';
import { FtStrategy } from './strategy/ft.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UserStrategy } from './strategy/user.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User]),
    JwtModule.register({}),
    FtAuthConfigModule,
    GoogleAuthConfigModule,
    GithubAuthConfigModule,
    JwtConfigModule,
    MailerModule,
    AppConfigModule,
    CacheModule.register({
      store: 'memory',
      ttl: TWO_FA_EXPIRES_IN,
      max: TWO_FA_MAX,
    }),
  ],
  providers: [AuthService, FtStrategy, UserStrategy, GoogleStrategy, GithubStrategy, LocalStrategy, UserGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
