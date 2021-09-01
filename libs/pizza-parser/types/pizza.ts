import { Ingredient } from './ingredient';

export interface Variant {
  size: number; // 30cm
  price: number; // 135grn
  weight: number; // 400g
  link: string; // http://pizza.com
  image: string; // http://pizza.com/image
}

export const supportedLangs = ['uk', 'ru', 'en'] as const;
export type Lang = typeof supportedLangs[number];

export const supportedCountries = ['ukraine'] as const;
export type County = typeof supportedCountries[number];

export const supportedCities = ['chernivtsi'] as const;
export type City = typeof supportedCities[number];

export interface Pizza {
  title: string;
  description: string;
  ingredients: Ingredient[];
  lang: Lang;
  variants: Variant[];
  country: County;
  city: City;
}

type TranslatedPizzaTitles = `${Lang}_title`;
type TranslatedPizzaDescription = `${Lang}_description`;

export type TranslatedPizza = Exclude<Pizza, 'title' | 'description'> &
  {
    [key in TranslatedPizzaTitles | TranslatedPizzaDescription]: string;
  };
