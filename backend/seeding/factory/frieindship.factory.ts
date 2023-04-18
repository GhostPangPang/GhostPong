// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';
import { User } from '../../src/entity/user.entity';

export default (user1: User, user2: User) => {
  return {
    sender: user1,
    receiver: user2,
    accept: faker.datatype.boolean(),
    lastMessegeTime: faker.datatype.boolean() ? faker.date.past() : undefined,
  };
};
