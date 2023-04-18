//import dotenv
import { config } from 'dotenv';

import { DataSource, DataSourceOptions } from 'typeorm';
import seeder from './seeder/message.seeder';
//import { runSeeders, SeederOptions } from 'typeorm-extension';
import * as path from 'path';

import { Auth } from '../src/entity/auth.entity';
import { User } from '../src/entity/user.entity';
import { Friendship } from '../src/entity/friendship.entity';
import { Message } from '../src/entity/message.entity';
import { MessageView } from '../src/entity/message-view.entity';
import { UserRecord } from '../src/entity/user-record.entity';
import { GameHistory } from '../src/entity/game-history.entity';
import { BlockedUser } from '../src/entity/blocked-user.entity';
import { Achievement } from '../src/entity/achievement.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

(async () => {
  if (process.argv[2] === undefined) {
    console.log('Please enter the number of auths to be created.');
  }

  const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.TEST_DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    entities: [Auth, User, Friendship, Message, MessageView, UserRecord, GameHistory, BlockedUser, Achievement],
    namingStrategy: new SnakeNamingStrategy(),
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await seeder(dataSource);
})();
