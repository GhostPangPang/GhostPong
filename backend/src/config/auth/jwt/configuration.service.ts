import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  // registered user
  get userSecretKey() {
    return this.configService.get<string>('jwt.userSecretKey');
  }

  get userExpireIn() {
    return this.configService.get<string>('jwt.userExpireIn');
  }

  // unregistered user
  get authSecretKey() {
    return this.configService.get<string>('jwt.authSecretKey');
  }

  get authExpireIn() {
    return this.configService.get<string>('jwt.authExpireIn');
  }
}
