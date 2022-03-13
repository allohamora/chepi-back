import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const kartoteka: Company = {
  slug: 'kartoteka',
  id: 1323,
  categories: [{ id: 16173, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/мацарела/i, 'моцарела')
        .replace(/песто власного приготування/i, 'соус "Песто"')
        .replace(/соус чимічуррі/i, 'соус "Чимічуррі"')
        .replace(/томати/i, 'помідори')
        .replace(/(.+?) та (.+?)/i, '$1, $2')
        .trim();

      return capitalize(fixed);
    },
  },
};
