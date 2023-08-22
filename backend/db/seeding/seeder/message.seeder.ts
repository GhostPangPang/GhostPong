import { faker } from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';

import { Auth, AuthStatus } from '../../../src/entity/auth.entity';
import { Friendship } from '../../../src/entity/friendship.entity';
import { GameHistory } from '../../../src/entity/game-history.entity';
import { Message } from '../../../src/entity/message.entity';
import { UserRecord } from '../../../src/entity/user-record.entity';
import { User } from '../../../src/entity/user.entity';
import authFactory from '../factory/auth.factory';
import frieindshipFactory from '../factory/frieindship.factory';
import gameHistoryFactory from '../factory/game-history.factory';
import messageFactory from '../factory/message.factory';
import userFactory from '../factory/user.factory';

export default async (dataSource: DataSource) => {
  await dataSource.transaction(async (manager) => {
    const authRepository: Repository<Auth> = manager.getRepository(Auth);
    const authSeeds = Array(Number(process.argv[2])).fill(null).map(authFactory);
    authSeeds[0].status = AuthStatus.REGISTERD;
    authSeeds[1].status = AuthStatus.REGISTERD;
    authSeeds[2].status = AuthStatus.REGISTERD;

    const auths = await authRepository.save(authSeeds);

    // generate user
    const userRepository = manager.getRepository(User);
    const users = await userRepository.save(auths.filter((auth) => auth.status === 'REGISTERD').map(userFactory));

    // generate user record
    const userRecord = users.map((user) => ({
      id: user.id,
    }));

    await manager.getRepository(UserRecord).save(userRecord);

    // generate friendship
    // 1/2 확률로 친구관계 생기게, 그 중 1/2 확률로 accept.
    const friendsSeed = [];
    for (let i = 0; i < users.length; i++) {
      for (let j: number = i + 1; j < users.length; j++) {
        if (i == 0 && j == 1) {
          friendsSeed.push(frieindshipFactory(users[i], users[j], true, faker.date.past()));
          continue;
        } else if (i == 0 && j == 2) {
          friendsSeed.push(frieindshipFactory(users[i], users[j], false));
          continue;
        }

        const isFirstUserI = faker.datatype.boolean();
        Math.random() <= 0.1 &&
          friendsSeed.push(
            frieindshipFactory(users[isFirstUserI ? i : j], users[isFirstUserI ? j : i], faker.datatype.boolean()),
          );
      }
    }

    const friendshipRepository = manager.getRepository(Friendship);
    const friends = await friendshipRepository.save(friendsSeed);

    // generate message
    // 친구 수락 && 마지막 메세지 시간이 있으면 메세지 생성
    const messageRepository = manager.getRepository(Message);

    const messageSeed: Partial<Message>[] = [];
    friends
      .filter((friend) => friend.lastMessageTime !== undefined && friend.accept === true)
      .map((friend) => {
        const random = Math.floor(Math.random() * 200);
        let prevDate: Date | undefined = undefined;
        for (let i = 0; i < random; i++) {
          const message = messageFactory(friend, prevDate);
          messageSeed.push(message);
          prevDate = new Date(message.createdAt);
        }
      });

    // insert 할 양이 많으면 error 가 발생하므로 100개씩 나눠서 insert
    const promises = [];
    for (let i = 0; i < messageSeed.length; i += 100) {
      promises.push(messageRepository.save(messageSeed.slice(i, i + 100)));
    }
    await Promise.all(promises);

    const gameSeed = [];
    for (let i = 0; i < users.length; i++) {
      for (let j: number = i + 1; j < users.length; j++) {
        const isFirstUserI = faker.datatype.boolean();
        Math.random() <= 0.1 &&
          gameSeed.push(gameHistoryFactory(users[isFirstUserI ? i : j], users[isFirstUserI ? j : i]));
      }
    }
    const gameHistoryRepository = manager.getRepository(GameHistory);
    await gameHistoryRepository.save(gameSeed);

    console.log('auth ' + auths.length + ' rows created.');
    console.log('user ' + users.length + ' rows created.');
    console.log('friendship ' + friends.length + ' rows created.');
    console.log('message ' + messageSeed.length + ' rows created.\n');
    console.log('game history ' + gameSeed.length + ' rows created.\n');
  });
};
