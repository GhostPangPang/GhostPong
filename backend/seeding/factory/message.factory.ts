// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';

import { Friendship } from '../../src/entity/friendship.entity';

export default (friendship: Friendship) => {
  return {
    senderId: faker.datatype.boolean() ? friendship.sender.id : friendship.receiver.id,
    friendId: friendship.id,
    content: faker.lorem.sentence(),
    createdAt: faker.date.past(1, friendship.lastMessegeTime),
  };
};
