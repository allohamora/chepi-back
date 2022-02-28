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

const translatedMock: Translated = {
  id: '',
  country: 'ukraine',
  city: 'chernivtsi',
  lang: 'uk',
  size: 0,
  weight: 0,
  price: 0,
  image: '',
  link: '',
  uk_title: '',
  uk_description: '',
  en_title: '',
  en_description: '',
  ru_title: '',
  ru_description: '',
};

export const translatedKeys = Object.keys(translatedMock) as (keyof Translated)[];
const translatedValuesSet = new Set([
  ...Object.values(translatedMock).map((value) => (value === null ? 'null' : typeof value)),
  'undefined',
]);
export const translatedValues = Array.from(translatedValuesSet);

export type TranslatedKey = keyof Translated;
export type TranslatedValue = Translated[keyof Translated] | undefined;

export interface Change {
  key: TranslatedKey;
  old?: TranslatedValue;
  new?: TranslatedValue;
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
