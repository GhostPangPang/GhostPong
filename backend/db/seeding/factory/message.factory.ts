// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';

import { Friendship } from '../../../src/entity/friendship.entity';

export default (friendship: Friendship, prevDate?: Date) => {
  prevDate?.setDate(prevDate?.getDate() + faker.datatype.number({ min: 1, max: 10 }));
  return {
    senderId: faker.datatype.boolean() ? friendship.sender.id : friendship.receiver.id,
    friendId: friendship.id,
    content: faker.lorem.sentence(),
    createdAt: prevDate || faker.date.past(2, friendship.lastMessageTime),
  };
};
