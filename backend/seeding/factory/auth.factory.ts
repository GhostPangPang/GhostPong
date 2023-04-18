// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';
import { AuthStatus } from '../../src/entity/auth.entity';

export default () => ({
  //auth.id is auto generated
  status: faker.datatype.boolean() && faker.datatype.boolean() ? AuthStatus.UNREGISTERD : AuthStatus.REGISTERD,
  email: faker.internet.email(),
});
