import { Injectable } from '@nestjs/common';

import { TwoFactorAuth } from './model/two-factor-auth';
import { Repository } from './repository.interface';

@Injectable()
export class TwoFactorAuthRepository implements Repository<string, TwoFactorAuth> {
  private readonly twoFactorAuthList: Map<string, TwoFactorAuth> = new Map<string, TwoFactorAuth>();

  insert(value: TwoFactorAuth): string {
    this.twoFactorAuthList.set(value.email, value);
    return value.email;
  }

  update(email: string, partial: Partial<TwoFactorAuth>): TwoFactorAuth | undefined {
    const target = this.twoFactorAuthList.get(email);
    if (target === undefined) {
      return undefined;
    }
    const updatedTwoFactorAuth = { ...target, ...partial };
    this.twoFactorAuthList.set(email, updatedTwoFactorAuth);
    return updatedTwoFactorAuth;
  }

  delete(email: string): boolean {
    return this.twoFactorAuthList.delete(email);
  }

  find(email: string): TwoFactorAuth | undefined {
    return this.twoFactorAuthList.get(email);
  }
}
