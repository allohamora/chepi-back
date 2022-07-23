import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const yummy: Company = {
  slug: 'yummy-cv',
  pizzaCompany: {
    en_company: 'Yummy',
    ru_company: 'Yummy',
    uk_company: 'Yummy',
  },
  id: 3533,
  categories: [
    { id: 42943, size: 30, slug: 'pizza-30' },
    { id: 42944, size: 40, slug: 'pizza-40' },
  ],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/папероні/gi, 'пепероні')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/\.$/, '')
        .replace(/папероні/gi, 'пепероні')
        .replace(/томати/, 'помідори')
        .trim();

      return capitalize(fixed);
    },
  },
};
