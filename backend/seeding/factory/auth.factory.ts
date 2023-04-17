// file name should be <entityName>.factory.ts

import { Faker } from '@faker-js/faker';
import { Auth, AuthStatus } from '../../src/entity/auth.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Auth, (faker: Faker) => {
  const auth = new Auth();

  //auth.id is auto generated
  //auth.status = faker.datatype.boolean() ? AuthStatus.REGISTERD : AuthStatus.UNREGISTERD;
  auth.status = AuthStatus.REGISTERD;
  auth.email = faker.internet.email();

  return auth;
});
