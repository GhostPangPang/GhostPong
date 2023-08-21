import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthConfigService {
  constructor(private configService: ConfigService) {}

  get clientId() {
    return this.configService.get<string>('googleAuth.clientId');
  }

  get clientSecret() {
    return this.configService.get<string>('googleAuth.clientSecret');
  }

  get callbackUrl() {
    return this.configService.get<string>('googleAuth.callbackUrl');
  }
}
