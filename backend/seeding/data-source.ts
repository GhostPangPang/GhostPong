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

config({
  path: '.env.development',
});

(async () => {
  if (process.argv[2] === undefined) {
    console.log('Please enter the number of auths to be created.');
    console.log('ex) yarn seed 300\n');
    process.exit(1);
  }

  const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    synchronize: true,
    entities: [Auth, User, Friendship, Message, MessageView, UserRecord, GameHistory, BlockedUser, Achievement],
    namingStrategy: new SnakeNamingStrategy(),
  };

  const dataSource = new DataSource(options);

  try {
    await dataSource.initialize();
  } catch (e) {
    console.table(e);
    console.log(e);
    if (e.code === 'ENOTFOUND') {
      console.error('Please check the database connection options in the .env file.\n');
    }
    await dataSource.destroy();
    process.exit(1);
  }
  try {
    await seeder(dataSource);
  } catch (e) {
    console.error(e);
    if (e.code === '23505') {
      console.error(
        '\nSeeding data already exists.\nYou can either run "yarn seed reset" to reset the seeding or continue with the development process without performing any seeding.\n',
      );
    }
    await dataSource.destroy();
    process.exit(1);
  }
  await dataSource.destroy();
})();
