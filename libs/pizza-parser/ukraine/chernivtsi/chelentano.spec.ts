import { Chelentano } from './chelentano';

let parser: Chelentano;

beforeEach(() => {
  parser = new Chelentano();
});

describe('parsePizza', () => {
  test('must return a pizza array', async () => {
    const pizzas = await parser.parsePizzas();

    expect(pizzas).toBeInstanceOf(Array);
    expect(pizzas[0]).not.toBe(undefined);
    expect(pizzas[0].title).not.toBe(undefined);
  });
});
