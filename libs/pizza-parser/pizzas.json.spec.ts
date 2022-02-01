import { timestamp, pizzas } from 'pizzas.json';

const expectTypeof = <V>(value: V, type: 'object' | 'string' | 'number') => expect(typeof value).toBe(type);
const expectString = <V>(value: V) => expectTypeof(value, 'string');
const expectObject = <V>(value: V) => expectTypeof(value, 'object');
const expectNumber = <V>(value: V) => expectTypeof(value, 'number');
const expectNumberOrNull = <V>(value: V) => expect(typeof value === 'number' || value === null).toBe(true);

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
