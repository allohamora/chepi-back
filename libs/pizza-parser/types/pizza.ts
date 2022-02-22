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

export interface Change {
  key: string;
  old: unknown;
  new: unknown;
  discoveredAt: number;
}

export type WithChanges = Translated & {
  changes?: Change[];
};

export type PizzaJson = WithChanges;

export interface PizzasJson {
  updatedAt: number;
  pizzas: PizzaJson[];
}
