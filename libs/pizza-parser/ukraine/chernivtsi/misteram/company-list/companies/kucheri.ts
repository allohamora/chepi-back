import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const kucheri: Company = {
  slug: 'kucheri',
  id: 1111,
  categories: [{ id: 14047, size: 30, slug: 'pizza', blacklist: [/фокача/i] }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/соус пелаті/i, 'соус Пелаті')
        .replace(/перець Чилі/i, 'перець чилі')
        .replace(/картопля "ФРІ"/i, 'картопля фрі')
        .replace(/едем/i, 'едам')
        .replace(/айзберг/i, 'салат Айсберг')
        .replace(/козиний сир/i, 'козячий сир');

      return capitalize(fixed);
    },
  },
};
