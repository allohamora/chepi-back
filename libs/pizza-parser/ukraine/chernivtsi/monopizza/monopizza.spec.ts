import { Monopizza } from '.';

let parser: Monopizza;

beforeEach(() => {
  parser = new Monopizza();
});

describe('parsePizza', () => {
  test('must return a pizza array', async () => {
    const pizzas = await parser.parsePizzas();

    expect(pizzas).toBeInstanceOf(Array);
    expect(pizzas[0]).not.toBe(undefined);
    expect(pizzas[0].title).not.toBe(undefined);
  });
});
