import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const monopoli: Company = {
  slug: 'monopoli',
  pizzaCompany: {
    en_company: 'Monopoli',
    ru_company: 'Monopoli',
    uk_company: 'Monopoli',
  },
  id: 803,
  categories: [{ id: 13020, size: null, blacklist: [/фокаччо/i], slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/помідор/i, 'помідори')
        .replace(/помідории/i, 'помідори')
        .replace(/чері/i, 'помідори чері')
        .replace(/масліни/i, 'маслини')
        .replace(/соус Цезар/i, 'соус Цезар')
        .replace(/соус Пелаті/i, 'соус Пелаті')
        .replace(/сир тофу/i, 'тофу')
        .replace(/печериці-гриль/i, 'печериці гриль');

      return capitalize(fixed);
    },
  },
};
