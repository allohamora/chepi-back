import { Pizza } from './pizza';

export interface PizzasParser {
  parsePizzas(): Promise<Pizza[]>;
}
