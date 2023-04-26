import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FtAuthConfigModule } from '../config/auth/ft/configuration.module';
import { JwtConfigModule } from '../config/auth/jwt/configuration.module';
import { JwtConfigService } from '../config/auth/jwt/configuration.service';
import { Auth } from '../entity/auth.entity';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategy/auth.strategy';
import { FtOAuthStrategy } from './strategy/ft-oauth.strategy';
import { UserStrategy } from './strategy/user.strategy';

@Module({
  // 사용할 entity
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({}),
    // JwtModule.registerAsync({
    //   imports: [JwtConfigModule],
    //   useFactory: async (jwtConfigService: JwtConfigService) => ({
    //     secret: jwtConfigService.userSecretKey,
    //     signOptions: { expiresIn: jwtConfigService.userExpireIn },
    //   }),
    //   inject: [JwtConfigService],
    // }),
    // JwtModule.registerAsync({
    //   imports: [JwtConfigModule],
    //   useFactory: async (jwtConfigService: JwtConfigService) => ({
    //     secret: jwtConfigService.authSecretKey,
    //     signOptions: { expiresIn: jwtConfigService.authExpireIn },
    //   }),
    //   inject: [JwtConfigService],
    // }),
    FtAuthConfigModule,
    forwardRef(() => JwtConfigModule),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, FtOAuthStrategy, AuthStrategy, UserStrategy, JwtConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
