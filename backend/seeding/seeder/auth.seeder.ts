import { DataSource, MoreThan, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Auth } from '../../src/entity/auth.entity';

export default class AuthSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const repository: Repository<Auth> = dataSource.getRepository(Auth);
    repository.delete({ id: MoreThan(0) });
    //await repository.insert([
    //  {
    //    firstName: 'Caleb',
    //    lastName: 'Barrows',
    //    email: 'caleb.barrows@gmail.com',
    //  },
    //]);

    // ---------------------------------------------------

    const authFactory = await factoryManager.get(Auth);
    // save 1 factory generated entity, to the database
    //await authFactory.save();

    // save 5 factory generated entities, to the database
    await authFactory.saveMany(1000);
  }
}
