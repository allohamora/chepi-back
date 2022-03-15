import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const gorno: Company = {
  slug: 'gorno',
  id: 1338,
  categories: [
    { id: 16461, size: 30, slug: 'pizza30' },
    { id: 16704, size: 50, slug: 'pizza50' },
  ],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/папероні/i, 'пепероні')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/листя міксу/i, 'листя салату')
        .replace(/сир тв./i, 'сир твердий')
        .replace(/соус цезар/i, 'соус Цезар')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/томати/i, 'помідори')
        .replace(/ф.куряче/i, 'філе куряче')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/папероні/i, 'пепероні')
        .trim();

      return capitalize(fixed);
    },
  },
};
