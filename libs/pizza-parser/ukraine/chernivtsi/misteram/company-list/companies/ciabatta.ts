import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const ciabatta: Company = {
  slug: 'ciabatta',
  pizzaCompany: {
    en_company: 'Ciabatta',
    ru_company: 'Ciabatta',
    uk_company: 'Ciabatta',
  },
  id: 1069,
  categories: [{ id: 13168, size: 30, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/мисл.ковбаски/i, 'мисливські ковбаски')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/тісто(, )?/i, '')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/дор блю/, 'дорблю')
        .trim();

      return capitalize(fixed);
    },
  },
};
