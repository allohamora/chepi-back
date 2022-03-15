import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const lapasta: Company = {
  slug: 'lapasta',
  id: 3134,
  categories: [{ id: 38384, size: null, slug: 'pizza', remove: [/,?\s+зауважте.+$/u], blacklist: [/фокачча/] }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/ді карне/i, 'Ді Карне')
        .replace(/поло фунгі/i, 'Поло Фунгі')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/табаско/i, 'соус Табаско')
        .replace(/соус BBQ/i, 'соус Барбекю')
        .replace(/філадельфія/i, 'сир Філадельфія')
        .replace(/чері/i, 'помідори чері')
        .trim();

      return capitalize(fixed);
    },
  },
};
