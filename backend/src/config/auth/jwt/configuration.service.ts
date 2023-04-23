import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secretKey() {
    return this.configService.get<string>('jwt.secretKey');
  }

  get expireIn() {
    return this.configService.get<string>('jwt.expireIn');
  }
}
