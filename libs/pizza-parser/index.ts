import ukraine from './ukraine';
import { PizzasParser } from './types/parser';
import { Pizza } from './types/pizza';

const parsers: PizzasParser[] = [...ukraine].map((Parser) => new Parser());

export const parsePizzas = async () => {
  const pizzasPromises = parsers.reduce<Promise<Pizza[]>[]>((state, parser) => [...state, parser.parsePizzas()], []);
  const pizzasNested = await Promise.all(pizzasPromises);
  const pizzas = pizzasNested.flat(1);

  return pizzas;
};
