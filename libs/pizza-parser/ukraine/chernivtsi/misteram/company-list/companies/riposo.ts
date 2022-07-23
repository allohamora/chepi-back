import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const riposo: Company = {
  slug: 'riposo',
  pizzaCompany: {
    en_company: 'Riposo',
    ru_company: 'Riposo',
    uk_company: 'Riposo',
  },
  id: 635,
  categories: [{ id: 7666, size: null, slug: 'pizza' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/папероні/i, 'пепероні')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/моцарела бебі/i, 'моцарела Бебі')
        .replace(/соус розмариновий песто/i, 'соус розмариновий Песто')
        .replace(/Пармезан/, 'пармезан')
        .replace(/Дор блю/, 'дорблю')
        .replace(/папероні/i, 'пепероні')
        .replace(/чілі/i, 'чилі')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/\./gi, ',')
        .replace(/,$/, '')
        .replace(/чері/g, 'помідори чері')
        .trim();

      return capitalize(fixed);
    },
  },
};
