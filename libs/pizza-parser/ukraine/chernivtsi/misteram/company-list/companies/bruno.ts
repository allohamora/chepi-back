import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const bruno: Company = {
  slug: 'bruno',
  pizzaCompany: {
    en_company: 'Bruno',
    ru_company: 'Bruno',
    uk_company: 'Bruno',
  },
  id: 669,
  categories: [{ id: 8166, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/томатний соус "Пелаті"/i, 'соус Пелаті')
        .replace(/соус томатний "Пелаті"/i, 'соус Пелаті')
        .replace(/"(.+?)"/g, '$1')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/айсберг/i, 'салат Айсберг')
        .replace(/сир фета/i, 'фета')
        .replace(/сир сулугуні/i, 'сулугуні')
        .replace(/сир гауда/i, 'гауда')
        .replace(/томати/i, 'помідори')
        .replace(/\.$/, '');

      return capitalize(fixed);
    },
  },
};
