import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const kartoteka: Company = {
  slug: 'kartoteka',
  pizzaCompany: {
    en_company: 'Kartoteka',
    ru_company: 'Картотека',
    uk_company: 'Картотека',
  },
  id: 1323,
  categories: [{ id: 16173, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/мацарела/i, 'моцарела')
        .replace(/молода моцарела/i, 'моцарела')
        .replace(/песто власного приготування/i, 'соус Песто')
        .replace(/соус чимічуррі/i, 'соус Чимічуррі')
        .replace(/томати/i, 'помідори')
        .replace(/болгарський перець/i, 'перець болгарський')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/вершкова основа/i, 'вершки')
        .replace(/(.+?) та (.+?)/i, '$1, $2')
        .replace(/"(.+?)"/i, '$1')
        .trim();

      return capitalize(fixed);
    },
  },
};
