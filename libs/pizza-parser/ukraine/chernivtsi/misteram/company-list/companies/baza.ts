import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const baza: Company = {
  slug: 'baza',
  id: 563,
  categories: [
    { id: 7067, size: 50, slug: 'pizza' },
    { id: 7068, size: 30, slug: 'pizza30' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/\./, ',')
        .replace(/«(.+?)»/, '"$1"')
        .replace(/ковбаса Баварська/i, 'ковбаса "Баварська"')
        .replace(/свіжа зелень/i, 'зелень')
        .replace(/фрі/, 'картопля фрі')
        .trim();

      return capitalize(fixed);
    },
  },
};
