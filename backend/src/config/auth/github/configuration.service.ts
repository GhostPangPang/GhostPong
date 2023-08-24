import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubAuthConfigService {
  constructor(private configService: ConfigService) {}

  get clientId() {
    return this.configService.get<string>('githubAuth.clientId');
  }

  get clientSecret() {
    return this.configService.get<string>('githubAuth.clientSecret');
  }

  get callbackUrl() {
    return this.configService.get<string>('githubAuth.callbackUrl');
  }
}
