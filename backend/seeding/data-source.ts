import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Achievement } from '../src/entity/achievement.entity';
import { Auth } from '../src/entity/auth.entity';
import { BlockedUser } from '../src/entity/blocked-user.entity';
import { Friendship } from '../src/entity/friendship.entity';
import { GameHistory } from '../src/entity/game-history.entity';
import { MessageView } from '../src/entity/message-view.entity';
import { Message } from '../src/entity/message.entity';
import { UserRecord } from '../src/entity/user-record.entity';
import { User } from '../src/entity/user.entity';

import seeder from './seeder/message.seeder';

config();

(async () => {
  if (process.argv[2] === undefined) {
    console.log('Please enter the number of auths to be created.');
    console.log('ex) yarn seed 300\n');
    process.exit(1);
  }

  const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.TEST_DB_NAME,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    synchronize: true,
    entities: [Auth, User, Friendship, Message, MessageView, UserRecord, GameHistory, BlockedUser, Achievement],
    namingStrategy: new SnakeNamingStrategy(),
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await seeder(dataSource);
})();
