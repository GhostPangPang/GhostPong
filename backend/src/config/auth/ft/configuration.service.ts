import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtAuthConfigService {
  constructor(private configService: ConfigService) {}

  get id() {
    return this.configService.get<string>('ftAuth.id');
  }

  get secret() {
    return this.configService.get<string>('ftAuth.secret');
  }

  get url() {
    return this.configService.get<string>('ftAuth.url');
  }
}
