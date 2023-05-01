import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env() {
    return this.configService.get<string>('app.env');
  }

  get url() {
    return this.configService.get<string>('app.url');
  }

  get appPort() {
    return Number(this.configService.get<number>('app.appPort'));
  }
}
