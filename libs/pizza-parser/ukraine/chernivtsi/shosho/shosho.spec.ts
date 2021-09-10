import { ShoSho } from '.';

let parser: ShoSho;

beforeEach(() => {
  parser = new ShoSho();
});

describe('parsePizza', () => {
  test('must return a pizza array', async () => {
    const pizzas = await parser.parsePizzas();
    console.log(pizzas);

    expect(pizzas).toBeInstanceOf(Array);
    expect(pizzas[0]).not.toBe(undefined);
    expect(pizzas[0].title).not.toBe(undefined);
  });
});
