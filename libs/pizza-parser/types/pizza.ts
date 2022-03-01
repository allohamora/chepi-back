import { TypeUnionToTypes } from './utils';

export const supportedLangs = ['uk', 'ru', 'en'] as const;
export type Lang = typeof supportedLangs[number];

export const supportedCountries = ['ukraine'] as const;
export type Country = typeof supportedCountries[number];

export const supportedCities = ['chernivtsi'] as const;
export type City = typeof supportedCities[number];

export interface Pizza {
  title: string; // my pizza
  description: string; // with pepper and pepperoni
  link: string; // http://pizza.com/buy-pizza/:id
  image: string; // http://pizza.com/image
  lang: Lang;
  size: number | null; // 30cm
  price: number | null; // 135grn
  weight: number | null; // 400g
  country: Country;
  city: City;
}

export interface WithId extends Pizza {
  id: string;
}

type TranslatedPizzaTitles = `${Lang}_title`;
type TranslatedPizzaDescription = `${Lang}_description`;

export type Translated = Omit<WithId, 'title' | 'description'> & {
  [key in TranslatedPizzaTitles | TranslatedPizzaDescription]: string;
};

export const historyOfChangesWatchKeys = [
  'image',
  'price',
  'weight',
  'uk_title',
  'uk_description',
  'en_title',
  'en_description',
  'ru_title',
  'ru_description',
] as const;
export const historyOfChangesValues = ['string', 'number', 'undefined'] as const;

export type HistoryOfChangesWatchKey = typeof historyOfChangesWatchKeys[number];
export type HistoryOfChangesValue = TypeUnionToTypes<typeof historyOfChangesValues[number]>;

export interface Change {
  key: HistoryOfChangesWatchKey;
  old?: HistoryOfChangesValue;
  new?: HistoryOfChangesValue;
  detectedAt: number;
}

export type WithHistory = Translated & {
  historyOfChanges?: Change[]; // order by detectedAt desc
};

export type PizzaJson = WithHistory;

export interface PizzasJson {
  updatedAt: number;
  pizzas: PizzaJson[];
}
