// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';
import { Friendship } from '../../src/entity/friendship.entity';

export default (friendship: Friendship) => {
  return {
    sender: faker.datatype.boolean() ? friendship.sender : friendship.receiver,
    friend: friendship,
    contents: faker.lorem.sentence(),
  };
};
