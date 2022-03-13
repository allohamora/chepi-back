import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const pastamia: Company = {
  slug: 'pastamia',
  id: 2255,
  categories: [{ id: 28784, size: null, slug: 'pizza', blacklist: [/пінца/] }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/томати/i, 'помідори')
        .replace(/салямі наполі,? піканте/i, 'салямі "Наполі Піканте"')
        .trim();

      return capitalize(fixed);
    },
  },
};
