// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';

import { User } from '../../src/entity/user.entity';

export default (user1: User, user2: User, accept: boolean, lastMessageTime?: Date) => {
  return {
    sender: user1,
    receiver: user2,
    accept,
    lastMessageTime: lastMessageTime || (accept && faker.datatype.boolean()) ? faker.date.past() : undefined,
  };
};
