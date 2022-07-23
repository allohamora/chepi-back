import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const baronGartenber: Company = {
  slug: 'baron-gartenberg',
  pizzaCompany: {
    en_company: 'Baron Gartenberg',
    ru_company: 'Baron Gartenberg',
    uk_company: 'Baron Gartenberg',
  },
  id: 4024,
  categories: [{ id: 47910, size: null, slug: 'pizza' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/папероні/gi, 'пепероні')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/основа/gi, '')
        .replace(/сир моцарела/gi, 'моцарела')
        .replace(/чері/, 'помідори чері')
        .replace(/горгонзола/gi, 'горгондзола')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/\.$/, '')
        .replace(/^,/, '')
        .trim();

      return capitalize(fixed);
    },
  },
};
