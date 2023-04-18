import { DataSource, Repository } from 'typeorm';
import * as fs from 'fs';

import { Auth } from '../../src/entity/auth.entity';
import { User } from '../../src/entity/user.entity';
import authFactory from '../factory/auth.factory';
import userFactory from '../factory/user.factory';
import { Friendship } from '../../src/entity/friendship.entity';
import * as path from 'path';

import frieindshipFactory from '../factory/frieindship.factory';
import messageFactory from '../factory/message.factory';
import { Message } from '../../src/entity/message.entity';

export default async (dataSource: DataSource) => {
  const resultDir = path.join(__dirname, '../results');

  const authRepository: Repository<Auth> = dataSource.getRepository(Auth);
  const auths = await authRepository.save(Array(Number(process.argv[2])).fill(null).map(authFactory));
  //const auths = await factoryManager.get(Auth).saveMany(Number(process.argv[2]));
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

  // generate friendship
  // 1/2 확률로 친구관계 생기게, 그 중 1/2 확률로 accept.
  const friendsSeed = [];
  for (let i: number = 0; i < users.length; i++) {
    for (let j: number = i + 1; j < users.length; j++) {
      Math.random() <= 0.1 && friendsSeed.push(frieindshipFactory(users[i], users[j]));
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
      for (let i: number = 0; i < random; i++) {
        messageSeed.push(messageFactory(friend));
      }
    });

  const promises = [];
  for (let i: number = 0; i < messageSeed.length; i += 10) {
    promises.push(messageRepository.save(messageSeed.slice(i, i + 10)));
  }
  const messages = await Promise.all(promises);

  console.log('message ' + messages.length + ' rows created.');

  fs.writeFile(path.join(resultDir, 'messages.json'), JSON.stringify(messages), (err) => {
    if (err) throw err;
    console.log('created message information has been saved to seeding/results/messages.json\n');
  });

  dataSource.destroy();
};
