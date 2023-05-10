import { Injectable } from '@nestjs/common';

import { SocketId } from './model/socket-id';
import { Repository } from './repository.interface';

@Injectable()
export class SocketIdRepository implements Repository<number, SocketId> {
  private readonly socketIdMap: Map<number, SocketId> = new Map<number, SocketId>();

  insert(value: SocketId): number {
    this.socketIdMap.set(value.userId, value);
    return value.userId;
  }

  update(userId: number, value: SocketId): SocketId | undefined {
    if (this.find(userId) === undefined) {
      return undefined;
    }
    this.socketIdMap.set(userId, value);
    return value;
  }

  delete(userId: number): boolean {
    if (this.find(userId) === undefined) {
      return false;
    }
    this.socketIdMap.delete(userId);
    return true;
  }

  find(userId: number): SocketId | undefined {
    return this.socketIdMap.get(userId);
  }
}
