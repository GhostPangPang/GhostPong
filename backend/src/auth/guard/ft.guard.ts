import { Injectable, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtGuard extends AuthGuard('ft') implements CanActivate {}
