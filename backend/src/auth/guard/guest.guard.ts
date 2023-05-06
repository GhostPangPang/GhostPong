import { Injectable, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GuestGuard extends AuthGuard('guest') implements CanActivate {}
