// file name should be <entityName>.factory.ts

import { faker } from '@faker-js/faker';

import { Auth } from '../../src/entity/auth.entity';

export default (auth: Auth) => {
  return {
    id: auth.id,
    nickname: faker.helpers.unique(faker.word.noun, [{ length: { min: 3, max: 8 } }]),
    exp: faker.datatype.number(100000),
    image: faker.image.imageUrl(),
  };
};
