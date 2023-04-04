import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name() {
    return this.configService.get<string>('app.name');
  }

  get env() {
    return this.configService.get<string>('app.env');
  }

  get url() {
    return this.configService.get<string>('app.url');
  }

  get port() {
    return Number(this.configService.get<number>('app.port'));
  }
}
