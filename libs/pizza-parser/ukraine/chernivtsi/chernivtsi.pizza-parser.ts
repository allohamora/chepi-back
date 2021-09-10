import { PizzasParser } from 'libs/pizza-parser/types/parser';

export abstract class ChernivtsiPizzasParser extends PizzasParser {
  protected baseMetadata = {
    lang: 'uk',
    country: 'ukraine',
    city: 'chernivtsi',
  } as const;
}
