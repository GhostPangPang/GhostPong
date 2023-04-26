import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  // SECTION registered user
  get userSecretKey() {
    return this.configService.get<string>('jwt.userSecretKey');
  }

  get userExpireIn() {
    return this.configService.get<string>('jwt.userExpireIn');
  }

  get userJwtSignOptions() {
    return {
      secret: this.userSecretKey,
      expiresIn: this.userExpireIn,
    };
  }
  // !SECTION registered user

  // SECTION unregistered user
  get authSecretKey() {
    return this.configService.get<string>('jwt.authSecretKey');
  }

  get authExpireIn() {
    return this.configService.get<string>('jwt.authExpireIn');
  }

  get authJwtSignOptions() {
    return {
      secret: this.authSecretKey,
      expiresIn: this.authExpireIn,
    };
  }
  // !SECTION unregistered user
}
