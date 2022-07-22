import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const chicheri: Company = {
  slug: 'chicheri',
  pizzaCompany: {
    en_company: 'Chichery',
    ru_company: 'Чичери',
    uk_company: 'Чічері',
  },
  id: 448,
  categories: [{ id: 35368, size: 30, slug: 'pizza30' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/піца/i, '')
        .replace(/«(.+?)»/, '$1')
        .replace(/“(.+?)”/, '$1')
        .replace(/папероні/gi, 'пепероні')
        .trim()
        .replace(/-$/, '')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/руккола/i, 'рукола')
        .replace(/соус пелаті/i, 'соус Пелаті')
        .replace(/айзберг/i, 'салат Айсберг')
        .replace(/фрі/i, 'картопля фрі')
        .replace(/чілі/i, 'перець чилі')
        .replace(/чері/i, 'помідори чері')
        .replace(/помідори помідори чері/i, 'помідори чері')
        .replace(/едем/i, 'едам')
        .replace(/\.$/, '');

      return capitalize(fixed);
    },
  },
};
