import { updatedAt, pizzas } from 'pizzas.json';
import {
  expectString,
  expectNumber,
  expectObject,
  expectNumberOrNull,
  expectUndefined,
  expectOwnProperty,
} from './test/test.utils';
import { Change } from './types/pizza';

const expectChanges = (changes?: Change[]) => {
  if (!Array.isArray(changes)) {
    return expectUndefined(changes);
  }

  for (const change of changes) {
    expectString(change.key);
    expectOwnProperty(change, 'old');
    expectOwnProperty(change, 'new');
    expectNumber(change.discoveredAt);
  }
};

describe('pizzas.json', () => {
  test('have updatedAt', () => {
    expectNumber(updatedAt);
  });

  test('pizzas have all fields', () => {
    for (const pizza of pizzas) {
      expectObject(pizza);

      expectString(pizza.id);
      expectString(pizza.country);
      expectString(pizza.city);

      expectString(pizza.image);
      expectString(pizza.link);

      expectNumberOrNull(pizza.price);
      expectNumberOrNull(pizza.size);
      expectNumberOrNull(pizza.weight);

      expectString(pizza.uk_title);
      expectString(pizza.uk_description);

      expectString(pizza.ru_title);
      expectString(pizza.ru_description);

      expectString(pizza.en_title);
      expectString(pizza.en_description);

      expectChanges(pizza.changes);
    }
  });
});
