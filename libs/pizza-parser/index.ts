import ukraine from './ukraine';
import { PizzaParser } from './types/parser';
import { Pizza } from './types/pizza';

const parsers: PizzaParser[] = [...ukraine].map((Parser) => new Parser());

export const parsePizza = async () => {
  const pizzaPromises = parsers.reduce<Promise<Pizza[]>[]>((state, parser) => [...state, parser.parsePizzas()], []);
  const pizza = await Promise.all(pizzaPromises);

  return pizza;
};
