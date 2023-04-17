//import dotenv
import { config } from 'dotenv';

import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Auth } from '../src/entity/auth.entity';
import AuthSeeder from './seeder/auth.seeder';
import AuthFactory from './factory/auth.factory';

config();

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: 'testdb',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    entities: [Auth],
    seeds: [AuthSeeder],
    factories: [AuthFactory],
  };
  console.log('options: ', options);

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await runSeeders(dataSource);
})();
