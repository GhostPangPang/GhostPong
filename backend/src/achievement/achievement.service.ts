import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Achievement } from '../entity/achievement.entity';

/**
 * 1 : 첫 승리					// 첫 승리 축하드립니다!!
 * 2 : 승리 100회				// 승리 100회 달성!!
 * 3 : 총 게임 횟수 42회		// 게임을 42!!
 * 4 : 패배 횟수 42회			// 패배도 42!!
 * 5 : 첫 친구 만들어 봤을 때	// 드디어 친구가 생겼어요!!
 * 6 : 친구 10명 				// 인싸로 가는 첫 걸음!!
 * 7 : 친구 42명 				// 당신은 마당발!!
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
}
