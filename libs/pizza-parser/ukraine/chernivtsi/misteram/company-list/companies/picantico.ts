import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const picantico: Company = {
  slug: 'picantico',
  pizzaCompany: {
    en_company: 'Picantico',
    ru_company: 'Пикантико',
    uk_company: 'Пікантіко',
  },
  id: 1103,
  categories: [
    { id: 13559, size: 50, slug: 'pizza50' },
    { id: 13558, size: 35, slug: 'pizza35' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/тісто, /, '')
        .replace(/соус на вибір оберіть з переліку, /i, '')
        .replace(/соус на вибір оберіть зі списку, /i, '')
        .replace(/соус оберіть зі списку, /i, '')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/перець чілі/, 'перець чилі')
        .replace(/сир пармезан/, 'пармезан')
        .replace(/томати/i, 'помідори')
        .replace(/шампіньйони/i, 'печериці')
        .trim();

      return capitalize(fixed);
    },
  },
};
