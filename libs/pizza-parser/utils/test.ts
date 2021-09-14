import { PizzasParser } from '../types/parser';

interface Constructable<T> {
  new (...args: any): T;
}

const numberValueMatch = (value: number | null) => typeof value === 'number' || value === null;

export const pizzasParserTestSuit = (Parser: Constructable<PizzasParser>) => {
  jest.setTimeout(60000);

  describe('parsePizza', () => {
    let parser: PizzasParser;

    beforeEach(() => {
      parser = new Parser();
    });

    test('must return a pizza array', async () => {
      const pizzas = await parser.parsePizzas();

      expect(pizzas).toBeInstanceOf(Array);
      pizzas.forEach((pizza) => {
        expect(typeof pizza.title).toBe('string');
        expect(pizza.title[0] === ' ').toBe(false);
        expect(pizza.title[pizza.title.length - 1] === ' ').toBe(false);

        expect(typeof pizza.description).toBe('string');
        if (pizza.description.trim().length !== 0) {
          expect(pizza.description[0] === ' ').toBe(false);
          expect(pizza.description[pizza.description.length - 1] === ' ').toBe(false);
        }

        expect(typeof pizza.link).toBe('string');
        expect(typeof pizza.image).toBe('string');

        expect(typeof pizza.lang).toBe('string');
        expect(typeof pizza.country).toBe('string');
        expect(typeof pizza.city).toBe('string');

        expect(numberValueMatch(pizza.price)).toBeTruthy();
        expect(pizza.price).not.toBeNaN();

        expect(numberValueMatch(pizza.size)).toBeTruthy();
        expect(pizza.size).not.toBeNaN();

        expect(numberValueMatch(pizza.weight)).toBeTruthy();
        expect(pizza.weight).not.toBeNaN();
      });

      expect(pizzas[0]).not.toBe(undefined);
      expect(pizzas[0].title).not.toBe(undefined);
    });
  });
};
