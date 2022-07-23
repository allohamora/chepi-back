import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const floraPark: Company = {
  slug: 'florapark',
  pizzaCompany: {
    en_company: 'FloraPark',
    ru_company: 'FloraPark',
    uk_company: 'FloraPark',
  },
  id: 4072,
  categories: [{ id: 48387, size: 30, slug: 'pizza' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/горгонзола/i, 'горгондзола')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/ферментоване тісто/gi, '')
        .replace(/сир горгонзонла/gi, 'горгондзола')
        .replace(/сир горгонзола/gi, 'горгондзола')
        .replace(/сир моцарела/gi, 'моцарела')
        .replace(/сир пармезан/gi, 'пармезан')
        .replace(/томати/, 'помідори')
        .replace(/.$/, '')
        .trim()
        .replace(/^,/, '')
        .trim();

      return capitalize(fixed);
    },
  },
};
