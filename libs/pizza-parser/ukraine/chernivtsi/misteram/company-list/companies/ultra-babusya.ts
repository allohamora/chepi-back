import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const ultraBabusya: Company = {
  slug: 'ultra-babusya',
  pizzaCompany: {
    en_company: 'ULTRA BABUSYA',
    ru_company: 'ULTRA БАБУСЯ',
    uk_company: 'ULTRA БАБУСЯ',
  },
  id: 4051,
  categories: [{ id: 48192, size: null, slug: 'pizza' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title).replace(/-$/, '').trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/\.$/, '')
        .replace(/моцарелла/gi, 'моцарела')
        .replace(/сир моцарела/gi, 'моцарела')
        .replace(/чілі/, 'чилі')
        .replace(/"/g, '')
        .trim();

      return capitalize(fixed);
    },
  },
};
