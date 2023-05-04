// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';

import { User } from '../../src/entity/user.entity';

export default (user1: User, user2: User, accept: boolean, lastMessegeTime?: Date) => {
  return {
    sender: user1,
    receiver: user2,
    accept,
    lastMessegeTime: lastMessegeTime || (accept && faker.datatype.boolean()) ? faker.date.past() : undefined,
  };
};
