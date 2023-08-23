import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

class FtGuard extends AuthGuard('ft') {}

class GoogleGuard extends AuthGuard('google') {}

class GithubGuard extends AuthGuard('github') {}

@Injectable()
export class SocialGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const provider: string = request.params.provider;
    let guard: IAuthGuard;

    // using different guards depending on the provider
    if (provider === 'ft') {
      guard = new FtGuard();
    } else if (provider === 'google') {
      guard = new GoogleGuard();
    } else if (provider === 'github') {
      guard = new GithubGuard();
    } else {
      throw new NotFoundException('존재하지 않는 경로입니다.');
    }
    return guard.canActivate(context);
  }
}
