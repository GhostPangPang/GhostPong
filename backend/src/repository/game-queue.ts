import { Injectable } from '@nestjs/common';

@Injectable()
export class GameQueue {
  private queue: Set<number> = new Set();

  public insert(userId: number): void {
    this.queue.add(userId);
  }

  public delete(userId: number): void {
    this.queue.delete(userId);
  }

  public get(): number[] {
    return Array.from(this.queue);
  }

  public clear(): void {
    this.queue.clear();
  }

  public size(): number {
    return this.queue.size;
  }

  public exist(userId: number): boolean {
    return this.queue.has(userId);
  }
}
