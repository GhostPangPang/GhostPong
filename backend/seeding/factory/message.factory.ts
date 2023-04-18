// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';
import { Friendship } from '../../src/entity/friendship.entity';
import { Message } from '../../src/entity/message.entity';

export default (friendship: Friendship) => {
  return {
    sender: faker.datatype.boolean() ? friendship.sender : friendship.receiver,
    friend: friendship,
    contents: faker.lorem.sentence(),
    createdAt: faker.date.past(1, friendship.lastMessegeTime),
  };
};
