import { PizzasParser } from '../types/parser';
import { Constructable } from '../types/utils';
import { expectNumberOrNull, expectObject, expectString, expectTrimmedString } from './test.utils';

const MAX_REQUEST_TIME_IN_MILISECONDS = 60000;

export const pizzasParserTestSuit = (Parser: Constructable<PizzasParser>) => {
  jest.setTimeout(MAX_REQUEST_TIME_IN_MILISECONDS);

  describe('parsePizza', () => {
    let parser: PizzasParser;

    beforeEach(() => {
      parser = new Parser();
    });

    test('return a pizza array', async () => {
      const pizzas = await parser.parsePizzas();
      expect(pizzas).toBeInstanceOf(Array);
      expect(pizzas.length >= 1).toBe(true);

      for (const pizza of pizzas) {
        expectObject(pizza);

        expectTrimmedString(pizza.title);
        expectString(pizza.description);

        const isDesriptionNotEmpty = pizza.description.trim().length !== 0;
        if (isDesriptionNotEmpty) {
          expectTrimmedString(pizza.description);
        }

        expectString(pizza.link);
        expectString(pizza.image);

        expectString(pizza.lang);
        expectString(pizza.country);
        expectString(pizza.city);

        expectNumberOrNull(pizza.price);
        expectNumberOrNull(pizza.size);
        expectNumberOrNull(pizza.weight);
      }

      const [firstPizza] = pizzas;

      expectObject(firstPizza);
      expectString(firstPizza.title);
    });
  });
};
