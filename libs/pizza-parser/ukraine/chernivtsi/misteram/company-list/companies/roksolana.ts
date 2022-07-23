import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const roksolana: Company = {
  slug: 'roksolana',
  pizzaCompany: {
    en_company: 'Roksolana ceremony hall',
    ru_company: 'Roksolana ceremony hall',
    uk_company: 'Roksolana ceremony hall',
  },
  id: 3565,
  categories: [{ id: 48283, size: null, slug: 'pizza' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title).replace(/ \)/, ')').trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/\.$/, '')
        .replace(/дор блю/gi, 'дорблю')
        .replace(/моцарелла/gi, 'моцарела')
        .trim();

      return capitalize(fixed);
    },
  },
};
