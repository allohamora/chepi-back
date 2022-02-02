import { timestamp, pizzas } from 'pizzas.json';
import { expectString, expectNumber, expectObject, expectNumberOrNull } from './test/test.utils';

describe('pizzas.json', () => {
  test('have timestamp', () => {
    expectNumber(timestamp);
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
    }
  });
});
