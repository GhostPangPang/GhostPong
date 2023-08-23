import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { FtGuard } from './ft.guard';
import { GithubGuard } from './github.guard';
import { GoogleGuard } from './google.guard';

@Injectable()
export class SocialGuard implements CanActivate {
  constructor(
    private readonly ftGuard: FtGuard,
    private readonly googleGuard: GoogleGuard,
    private readonly githubGuard: GithubGuard,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const provider: string = request.params.provider;
    if (provider === 'ft') {
      return this.ftGuard.canActivate(context);
    } else if (provider === 'google') {
      return this.googleGuard.canActivate(context);
    } else if (provider === 'github') {
      return this.githubGuard.canActivate(context);
    } else {
      throw new NotFoundException('존재하지 않는 provider입니다.');
    }
  }
}
