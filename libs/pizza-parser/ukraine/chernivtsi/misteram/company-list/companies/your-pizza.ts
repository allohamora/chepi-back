import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const yourPizza: Company = {
  slug: 'yourpizza',
  id: 3034,
  categories: [
    { id: 36919, size: 20, slug: 'pizza20' },
    { id: 36916, size: 30, slug: 'pizza30' },
    { id: 36913, size: 50, slug: 'pizza50' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/дор-блю/, 'дорблю')
        .replace(/королівський/, 'сир королівський')
        .replace(/Сир сир королівський/i, 'сир королівський')
        .replace(/соус Цезар/i, 'соус "Цезар"')
        .replace(/основа(, )?/i, '')
        .replace(/масліни/, 'маслини')
        .trim();

      return capitalize(fixed);
    },
  },
};
