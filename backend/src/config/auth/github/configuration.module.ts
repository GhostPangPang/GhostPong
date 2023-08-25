import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import configuration from './configuration';
import { GithubAuthConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration],
      validationSchema: Joi.object({
        GITHUB_CLIENT_ID: Joi.string(),
        GITHUB_CLIENT_SECRET: Joi.string(),
        GITHUB_CALLBACK_URL: Joi.string().default('http://localhost:3000/api/v1/auth/callback/github'),
      }),
    }),
  ],
  providers: [ConfigService, GithubAuthConfigService],
  exports: [ConfigService, GithubAuthConfigService],
})
export class GithubAuthConfigModule {}
