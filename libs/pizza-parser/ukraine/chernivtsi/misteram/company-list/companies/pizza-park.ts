import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const pizzaPark: Company = {
  slug: 'pizzapark',
  pizzaCompany: {
    en_company: 'Pizza Park',
    ru_company: 'Пицца парк',
    uk_company: 'Піца парк',
  },
  id: 420,
  categories: [{ id: 4798, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/масліни/i, 'маслини')
        .replace(/ротунда/i, 'перець ротунда')
        .trim();

      return capitalize(fixed);
    },
  },
};
