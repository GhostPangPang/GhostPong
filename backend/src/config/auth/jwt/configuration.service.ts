import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  // SECTION registered user
  get userSecretKey() {
    return this.configService.get<string>('jwt.userSecretKey');
    // return { secret: this.configService.get<string>('jwt.userSecretKey') };
  }

  get userExpireIn() {
    return { expiresIn: this.configService.get<string>('jwt.userExpireIn') };
  }

  get userJwtSignOptions() {
    return {
      // ...this.userSecretKey,
      secret: this.userSecretKey,
      expiresIn: this.configService.get<string>('jwt.userExpireIn'),
    };
  }
  // !SECTION registered user

  // SECTION unregistered user
  get authSecretKey() {
    return this.configService.get<string>('jwt.authSecretKey');
    // return { secret: this.configService.get<string>('jwt.authSecretKey') };
  }

  get authExpireIn() {
    return { expiresIn: this.configService.get<string>('jwt.authExpireIn') };
  }

  get authJwtSignOptions() {
    return {
      secret: this.authSecretKey,
      // ...this.authSecretKey,
      expiresIn: this.configService.get<string>('jwt.authExpireIn'),
    };
  }
  // !SECTION unregistered user
}
