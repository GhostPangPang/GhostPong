import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Auth } from '../../src/entity/auth.entity';

import { Migration1692710671031 } from './1692710671031-migration';

config({ path: '.env.development' });
if (process.env.NODE_ENV === 'production') {
  config();
}

const auth1692710671031 = Migration1692710671031;

export const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: false,
  logging: true,
  entities: [Auth],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [auth1692710671031],
};

const dataSource = new DataSource(options);

export default dataSource;
