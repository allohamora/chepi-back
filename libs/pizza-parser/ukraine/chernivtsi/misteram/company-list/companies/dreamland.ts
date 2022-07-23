import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const dreamland: Company = {
  slug: 'dreamland',
  pizzaCompany: {
    en_company: 'Kraina mriy',
    ru_company: 'Країна мрій',
    uk_company: 'Країна мрій',
  },
  id: 1886,
  categories: [{ id: 24227, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/сир моцарела/i, 'моцарела')
        .replace(/томати/, 'помідори')
        .trim();

      return capitalize(fixed);
    },
  },
};
