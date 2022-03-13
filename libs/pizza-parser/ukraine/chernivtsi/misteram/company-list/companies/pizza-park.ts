import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const pizzaPark: Company = {
  slug: 'pizzapark',
  id: 420,
  categories: [{ id: 4798, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
  },
};
