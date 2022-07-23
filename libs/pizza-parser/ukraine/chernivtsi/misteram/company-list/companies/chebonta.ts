import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const chebonta: Company = {
  slug: 'chebonta',
  pizzaCompany: {
    en_company: 'Chebonta',
    ru_company: 'Chebonta',
    uk_company: 'Chebonta',
  },
  id: 2754,
  categories: [
    { id: 34248, size: 50, slug: 'pizza50' },
    { id: 34245, size: 35, slug: 'pizza35' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/сир пармезан/i, 'пармезан')
        .replace(/томати/i, 'помідори')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/чілі/i, 'чилі')
        .replace('соус на вибір (оберіть з переліку), ', '')
        .replace('Соус на вибір (оберіть з переліку), ', '')
        .replace(/горгонзола/gi, 'горгондзола')
        .trim();

      return capitalize(fixed);
    },
  },
};
