import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const terassa: Company = {
  slug: 'terassa',
  id: 1124,
  categories: [{ id: 42425, size: 30, slug: 'pizza30' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/\//gi, ', ')
        .replace(/чері/i, 'помідори чері')
        .replace(/ементалер/i, 'емменталь')
        .replace(/дорблю/i, 'дорблю')
        .replace(/Перець пепероні/, 'перець пепероні')
        .replace(/Моцарела/, 'моцарела');

      return capitalize(fixed);
    },
  },
};
