// file name should be <entityName>.factory.ts
import { faker } from '@faker-js/faker';

import { User } from '../../src/entity/user.entity';

export default (user1: User, user2: User) => {
  return {
    winner: user1,
    loser: user2,
    winnerScore: faker.datatype.number(10),
    loserScore: faker.datatype.number(9),
  };
};
