import { PizzasParser } from '../types/parser';
import { Constructable } from '../types/utils';
import { combine } from '../utils/fp';
import {
  expectFalseTestFactory,
  expectNumberOrNull,
  expectObject,
  expectString,
  expectTrimmedString,
} from './test.utils';

const MAX_REQUEST_TIME_IN_MILISECONDS = 60000;

const ukNotContainBlacklistedWordTest = (value: string) => {
  const expectFalseTest = expectFalseTestFactory(value);

  expectFalseTest(/шампиньони?/i);
  expectFalseTest(/шампіньйони/i);
  expectFalseTest(/томати/i);

  expectFalseTest(/основа,?/i);
  expectFalseTest(/тісто/i);
  expectFalseTest(/борошно/i);

  expectFalseTest(/домашній /i);
  expectFalseTest(/фірмовий/i);

  expectFalseTest(/свіж[іа]/i);

  expectFalseTest(/піца/i);
  expectFalseTest(/pizza/i);

  expectFalseTest(/моцарелла/i);
  expectFalseTest(/дор блю/i);
  expectFalseTest(/папероні/i);
  expectFalseTest(/чілі/i);
  expectFalseTest(/цезаре/i);

  expectFalseTest(/сир моцарела/i);
  expectFalseTest(/сир гауда/i);
  expectFalseTest(/сир рокфор/i);
  expectFalseTest(/сир сулугуні/i);

  expectFalseTest(/(?<!помідор(и|ами) )(?<=\s|^)чері/i);
  expectFalseTest(/(?<!перець )(?<=\s|^)чилі/i);
  expectFalseTest(/(?<!перець )(?<=\s|^)болгарський/i);
  expectFalseTest(/(?<!картопля )(?<=\s|^)фрі/i);

  expectFalseTest(/^-$/i);
};

const notContainQuoteTest = (value: string) => {
  const expectFalseTest = expectFalseTestFactory(value);

  expectFalseTest(/"/);
  expectFalseTest(/«|»/);
  expectFalseTest(/“/);
};

const ukContentTest = combine(notContainQuoteTest, ukNotContainBlacklistedWordTest);

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

        if (pizza.lang === 'uk') {
          ukContentTest(pizza.title);
          ukContentTest(pizza.description);
        }

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
