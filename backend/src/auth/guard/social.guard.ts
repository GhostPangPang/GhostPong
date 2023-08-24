import { CanActivate, ExecutionContext, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

class FtGuard extends AuthGuard('ft') {}

class GoogleGuard extends AuthGuard('google') {}

class GithubGuard extends AuthGuard('github') {}

@Injectable()
export class SocialGuard implements CanActivate, OnModuleInit {
  private ftGuard: FtGuard;
  private googleGuard: GoogleGuard;
  private githubGuard: GithubGuard;

  onModuleInit() {
    this.ftGuard = new FtGuard();
    this.googleGuard = new GoogleGuard();
    this.githubGuard = new GithubGuard();
  }

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
