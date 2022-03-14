import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const mamasPizza: Company = {
  slug: 'mamaspizza',
  id: 1026,
  categories: [
    { id: 13687, size: 30, slug: 'pizza30', blacklist: [/фокача/i] },
    { id: 13686, size: 50, slug: 'pizza50', blacklist: [/фокача/i] },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/соус на вибір, /i, '')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/ковбаса папероні/i, 'папероні')
        .replace(/чері/i, 'помідори чері')
        .replace(/сир моцарела/i, 'моцарела')
        .replace(/сир Дор-блю/i, 'дорблю')
        .replace(/сир брі/i, 'брі')
        .replace(/сир пармезан/i, 'пармезан')
        .replace(/вершковий соус/i, 'соус вершковий')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/печерицін/i, 'печериці')
        .replace(/томати/i, 'помідори')
        .replace(/цибуля маринована в оцеті/i, 'цибуля маринована')
        .replace(/, /g, ',')
        .replace(/,/g, ', ')
        .trim();

      return capitalize(fixed);
    },
  },
};
