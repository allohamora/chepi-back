import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const chicheri: Company = {
  slug: 'chicheri',
  id: 448,
  categories: [{ id: 35368, size: 30, slug: 'pizza30' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/руккола/i, 'рукола')
        .replace(/соус пелаті/i, 'соус "Пелаті"')
        .replace(/айзберг/i, 'салат "Айсберг"')
        .replace(/фрі/i, 'картопля фрі')
        .replace(/чілі/i, 'перець чілі')
        .replace(/чері/i, 'помідори чері')
        .replace(/помідори помідори чері/i, 'помідори чері')
        .replace(/едем/i, 'едам');

      return capitalize(fixed);
    },
  },
};
