import * as fs from 'fs';
import * as path from 'path';

import { faker } from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';

import { Auth } from '../../src/entity/auth.entity';
import { Friendship } from '../../src/entity/friendship.entity';
import { GameHistory } from '../../src/entity/game-history.entity';
import { Message } from '../../src/entity/message.entity';
import { UserRecord } from '../../src/entity/user-record.entity';
import { User } from '../../src/entity/user.entity';
import authFactory from '../factory/auth.factory';
import frieindshipFactory from '../factory/frieindship.factory';
import gameHistoryFactory from '../factory/game-history.factory';
import messageFactory from '../factory/message.factory';
import userFactory from '../factory/user.factory';

export default async (dataSource: DataSource) => {
  const resultDir = path.join(__dirname, '../results');

  const authRepository: Repository<Auth> = dataSource.getRepository(Auth);
  const auths = await authRepository.save(Array(Number(process.argv[2])).fill(null).map(authFactory));
  console.log('auth ' + auths.length + ' rows created.');
  fs.mkdir(resultDir, () => {
    fs.writeFile(path.join(resultDir, 'auths.json'), JSON.stringify(auths), (err) => {
      if (err) throw err;
      console.log('created auth information has been saved to results/auths.json\n');
    });
  });

  // generate user
  const userRepository = dataSource.getRepository(User);
  const users = await userRepository.save(auths.filter((auth) => auth.status === 'REGISTERD').map(userFactory));
  console.log('user ' + users.length + ' rows created.');

  fs.writeFile(path.join(resultDir, 'users.json'), JSON.stringify(users), (err) => {
    if (err) throw err;
    console.log('created user information has been saved to seeding/results/users.json\n');
  });

  // generate user record
  const userRecord = users.map((user) => ({
    id: user.id,
  }));

  await dataSource.getRepository(UserRecord).save(userRecord);

  // generate friendship
  // 1/2 확률로 친구관계 생기게, 그 중 1/2 확률로 accept.
  const friendsSeed = [];
  for (let i = 0; i < users.length; i++) {
    for (let j: number = i + 1; j < users.length; j++) {
      const isFirstUserI = faker.datatype.boolean();
      Math.random() <= 0.1 &&
        friendsSeed.push(frieindshipFactory(users[isFirstUserI ? i : j], users[isFirstUserI ? j : i]));
    }
  }

  const friendshipRepository = dataSource.getRepository(Friendship);
  const friends = await friendshipRepository.save(friendsSeed);
  console.log('friendship ' + friends.length + ' rows created.');

  fs.writeFile(path.join(resultDir, 'friends.json'), JSON.stringify(friends), (err) => {
    if (err) throw err;
    console.log('created friendship information has been saved to seeding/results/friends.json\n');
  });

  // generate message
  // 친구 수락 && 마지막 메세지 시간이 있으면 메세지 생성
  const messageRepository = dataSource.getRepository(Message);

  const messageSeed: Partial<Message>[] = [];
  friends
    .filter((friend) => friend.lastMessegeTime !== undefined && friend.accept === true)
    .map((friend) => {
      const random = Math.floor(Math.random() * 200);
      for (let i = 0; i < random; i++) {
        messageSeed.push(messageFactory(friend));
      }
    });

  // insert 할 양이 많으면 error 가 발생하므로 100개씩 나눠서 insert
  const promises = [];
  for (let i = 0; i < messageSeed.length; i += 100) {
    promises.push(messageRepository.save(messageSeed.slice(i, i + 100)));
  }
  await Promise.all(promises);

  console.log('message ' + messageSeed.length + ' rows created.\n');

  //fs.writeFile(path.join(resultDir, 'messages.json'), JSON.stringify(messages), (err) => {
  //  if (err) throw err;
  //  console.log('created message information has been saved to seeding/results/messages.json\n');
  //});

  // generate game history

  const gameSeed = [];
  for (let i = 0; i < users.length; i++) {
    for (let j: number = i + 1; j < users.length; j++) {
      const isFirstUserI = faker.datatype.boolean();
      Math.random() <= 0.1 &&
        gameSeed.push(gameHistoryFactory(users[isFirstUserI ? i : j], users[isFirstUserI ? j : i]));
    }
  }
  const gameHistoryRepository = dataSource.getRepository(GameHistory);
  await gameHistoryRepository.save(gameSeed);

  console.log('game history ' + gameSeed.length + ' rows created.\n');

  dataSource.destroy();
};
