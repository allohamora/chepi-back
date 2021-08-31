import { Ingredient } from './ingredient';

export interface Variant {
  size: number; // 30cm
  price: number; // 135grn
  weight: number; // 400g
  link: string; // http://pizza.com
  image: string; // http://pizza.com/image
}

export interface Pizza {
  title: string;
  description: string;
  ingredients: Ingredient[];
  variants: Variant[];
  lang: 'ru' | 'uk' | 'us';
  country: 'ukraine';
  city: 'chernivtsi';
}
