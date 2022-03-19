import { Company as PizzaCompany } from 'libs/pizza-parser/types/pizza';

export type NormalizeHandler = (value: string) => string;

export interface Normalize {
  title?: NormalizeHandler;
  description?: NormalizeHandler;
}

export interface Category {
  slug: string;
  id: number;
  size: number | null;
  blacklist?: RegExp[];
  remove?: RegExp[];
}

export interface Company {
  slug: string;
  id: number;
  categories: Category[];
  normalize?: Normalize;
  pizzaCompany: PizzaCompany;
}
