import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const kucheri: Company = {
  slug: 'kucheri',
  pizzaCompany: {
    en_company: 'Kucheri',
    ru_company: 'Кучери',
    uk_company: 'Кучері',
  },
  id: 1111,
  categories: [{ id: 14047, size: 30, slug: 'pizza', blacklist: [/фокача/i] }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/папероні/gi, 'пепероні')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/соус пелаті/i, 'соус Пелаті')
        .replace(/чілі/gi, 'перець чилі')
        .replace(/перець Чилі/i, 'перець чилі')
        .replace(/картопля "ФРІ"/i, 'картопля фрі')
        .replace(/едем/i, 'едам')
        .replace(/айзберг/i, 'салат Айсберг')
        .replace(/козиний сир/i, 'козячий сир')
        .replace(/папероні/i, 'пепероні')
        .replace(/горгонзола/gi, 'горгондзола')
        .replace(/\.$/, '');

      return capitalize(fixed);
    },
  },
};
