import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FtAuthConfigModule } from '../config/auth/ft/configuration.module';
import { JwtConfigModule } from '../config/auth/jwt/configuration.module';
import { JwtConfigService } from '../config/auth/jwt/configuration.service';
import { Auth } from '../entity/auth.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtOAuthStrategy } from './strategy/ft-oauth.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  // 사용할 entity
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secretKey,
        signOptions: { expiresIn: jwtConfigService.expireIn },
      }),
      inject: [JwtConfigService],
    }),
    FtAuthConfigModule,
    JwtConfigModule,
  ],
  providers: [AuthService, FtOAuthStrategy, JwtStrategy, JwtConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
