import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Achievement } from '../entity/achievement.entity';
import { UserRecord } from '../entity/user-record.entity';

/**
 * 1 : 첫 승리                // 첫 승리 축하드립니다!!
 * 2 : 승리 100회             // 승리 100회 달성!!
 * 3 : 총 게임 횟수 42회      // 게임을 42!!
 * 4 : 패배 횟수 42회         // 패배도 42!!
 * 5 : 첫 친구 만들어 봤을 때 // 드디어 친구가 생겼어요!!
 * 6 : 친구 10명              // 인싸로 가는 첫 걸음!!
 * 7 : 친구 42명              // 당신은 마당발!!
 */

@Injectable()
export class AchievementService {
  // SECTION: public
  async getFriendAchievement(userId: number, count: number, manager: EntityManager): Promise<void> {
    if (count === 1) {
      await manager.save(Achievement, { user: { id: userId }, achievement: 5 });
    } else if (count === 10) {
      await manager.save(Achievement, { user: { id: userId }, achievement: 6 });
    } else if (count === 42) {
      await manager.save(Achievement, { user: { id: userId }, achievement: 7 });
    }
  }

  async getWinAchievement(userId: number, count: number, manager: EntityManager): Promise<void> {
    if (count === 1) {
      await manager.save(Achievement, { user: { id: userId }, achievement: 1 });
    } else if (count === 100) {
      await manager.save(Achievement, { user: { id: userId }, achievement: 2 });
    }
  }

  async getLoseAchievement(userId: number, count: number, manager: EntityManager): Promise<void> {
    if (count === 42) {
      await manager.save(Achievement, { user: { id: userId }, achievement: 4 });
    }
  }

  async getTotalGameAchievement(userId: number, count: number, manager: EntityManager): Promise<void> {
    if (count === 42) {
      await manager.save(Achievement, { user: { id: userId }, achievement: 3 });
    }
  }

  async checkWinnerAchievement(userId: number, manager: EntityManager): Promise<void> {
    const result = await manager.findOneBy(UserRecord, { user: { id: userId } });
    if (result === null) {
      return;
    }
    await this.getWinAchievement(userId, result.winCount, manager);
    await this.getTotalGameAchievement(userId, result.winCount + result.loseCount, manager);
  }

  async checkLoserAchievement(userId: number, manager: EntityManager): Promise<void> {
    const result = await manager.findOneBy(UserRecord, { user: { id: userId } });
    if (result === null) {
      return;
    }
    await this.getLoseAchievement(userId, result.loseCount, manager);
    await this.getTotalGameAchievement(userId, result.winCount + result.loseCount, manager);
  }
}
