import { Pizza } from './pizza';

export abstract class PizzasParser {
  public abstract parsePizzas(): Promise<Pizza[]>;
}
