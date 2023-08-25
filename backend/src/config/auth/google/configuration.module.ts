import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import configuration from './configuration';
import { GoogleAuthConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration],
      validationSchema: Joi.object({
        GOOGLE_CLIENT_ID: Joi.string(),
        GOOGLE_CLIENT_SECRET: Joi.string(),
        GOOGLE_CALLBACK_URL: Joi.string().default('http://localhost:3000/api/v1/auth/callback/google'),
      }),
    }),
  ],
  providers: [ConfigService, GoogleAuthConfigService],
  exports: [ConfigService, GoogleAuthConfigService],
})
export class GoogleAuthConfigModule {}
