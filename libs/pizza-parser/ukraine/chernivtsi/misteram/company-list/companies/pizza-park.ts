import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const pizzaPark: Company = {
  slug: 'pizzapark',
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
