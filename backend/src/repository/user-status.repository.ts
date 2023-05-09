import { Injectable } from '@nestjs/common';

import { UserStatus } from './model/user-status';
import { Repository } from './repository.interface';

/**
 * key: number (userId)
 * value: UserStatus
 */
@Injectable()
export class UserStatusRepository implements Repository<number, UserStatus> {
  private readonly userStatusList: Map<number, UserStatus>;

  insert(userStatus: UserStatus): number {
    this.userStatusList.set(userStatus.userId, userStatus);
    return userStatus.userId;
  }

  update(id: number, partialItem: Partial<UserStatus>): UserStatus | undefined {
    const userStatus = this.userStatusList.get(id);
    if (userStatus === undefined) {
      return undefined;
    }
    const updatedUserStatus = { ...userStatus, ...partialItem };
    this.userStatusList.set(id, { ...userStatus, ...partialItem });
    return updatedUserStatus;
  }

  delete(id: number): boolean {
    return this.userStatusList.delete(id);
  }

  find(id: number): UserStatus | undefined {
    return this.userStatusList.get(id);
  }
}
