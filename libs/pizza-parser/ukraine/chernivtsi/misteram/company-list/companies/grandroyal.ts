import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const grandroyal: Company = {
  slug: 'grandroyal',
  pizzaCompany: {
    en_company: 'Grand Royal',
    ru_company: 'Grand Royal',
    uk_company: 'Grand Royal',
  },
  id: 3863,
  categories: [
    { id: 46477, size: null, slug: 'pizza' },
    { id: 46490, size: null, slug: 'pizza-big' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/\.$/, '')
        .replace(/моцарелла/g, 'моцарела')
        .replace(/горгонзола/i, 'горгондзола')
        .replace(/папероні/i, 'пепероні')
        .replace(/сири/i, '')
        .replace(/болгарський перець/, 'перець болгарський')
        .replace(/"/g, '')
        .trim();

      return capitalize(fixed);
    },
  },
};
