import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const soda: Company = {
  slug: 'soda-rest',
  pizzaCompany: {
    en_company: 'S.О.D.A. Summer',
    ru_company: 'S.О.D.A. Summer',
    uk_company: 'S.О.D.A. Summer',
  },
  id: 4069,
  categories: [{ id: 48361, size: null, slug: 'pizza' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/цезаре/i, 'цезар')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/сир моцарела/i, 'моцарела')
        .replace(/сир пармезан/i, 'пармезан')
        .replace(/чері/gi, 'помідори чері')
        .replace(/дор блю/gi, 'дорблю')
        .replace(/чілі/, 'перець чилі')
        .replace(/\.$/, '')
        .trim();

      return capitalize(fixed);
    },
  },
};
