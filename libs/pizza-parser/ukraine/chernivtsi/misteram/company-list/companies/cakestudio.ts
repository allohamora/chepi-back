import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const cakestudio: Company = {
  slug: 'cakestudio',
  pizzaCompany: {
    en_company: 'Cake Studio by Mariia Tokar',
    ru_company: 'Cake Studio by Mariia Tokar',
    uk_company: 'Cake Studio by Mariia Tokar',
  },
  id: 3906,
  categories: [{ id: 46995, size: 30, slug: 'pizza' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title).trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/чері/, 'помідори чері')
        .replace(/дор блю/, 'дорблю')
        .replace(/болгарський перець/i, 'перець болгарський')
        .trim();

      return capitalize(fixed);
    },
  },
};
