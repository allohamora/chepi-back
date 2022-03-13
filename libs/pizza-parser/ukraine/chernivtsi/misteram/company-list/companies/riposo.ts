import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const riposo: Company = {
  slug: 'riposo',
  id: 635,
  categories: [{ id: 7666, size: 30, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/моцарела бебі/i, 'моцарела "Бебі"')
        .replace(/соус розмариновий песто/i, 'соус розмариновий "Песто"')
        .replace(/Пармезан/, 'пармезан')
        .replace(/Дор блю/, 'дорблю')
        .replace(/\./gi, ',')
        .trim();

      return capitalize(fixed);
    },
  },
};
