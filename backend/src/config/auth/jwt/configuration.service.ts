import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get userSecretKey() {
    return this.configService.get<string>('jwt.userSecretKey');
  }

  get authSecretKey() {
    return this.configService.get<string>('jwt.authSecretKey');
  }

  get twoFaSecretKey() {
    return this.configService.get<string>('jwt.twoFaSecretKey');
  }
}
