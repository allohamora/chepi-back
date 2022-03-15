import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const diverso: Company = {
  slug: 'diverso',
  id: 3076,
  categories: [{ id: 37363, size: null, slug: 'pizzaburgers', blacklist: [/бургер/] }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/«(.+?)»/, '$1')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/сири? моцарела/i, 'моцарела')
        .replace(/базилік свіжий/, 'базилік')
        .replace(/(.+?) та (.+?)/, '$1, $2')
        .replace(/соус цезар/i, 'соус Цезар')
        .trim();

      return capitalize(fixed);
    },
  },
};
