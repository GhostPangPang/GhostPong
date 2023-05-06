import { SetMetadata } from '@nestjs/common';

export const SkipUserGuard = () => SetMetadata('skipUserGuard', true);
