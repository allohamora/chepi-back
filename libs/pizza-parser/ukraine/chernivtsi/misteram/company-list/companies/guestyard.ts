import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const guestyard: Company = {
  slug: 'guestyard',
  pizzaCompany: {
    en_company: 'Guest yard',
    ru_company: 'Гостинный двор',
    uk_company: 'Гостинний двір',
  },
  id: 2633,
  categories: [{ id: 32894, size: 30, slug: 'pizza30' }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/«(.+?)»/, '$1')
        .replace(/“(.+?)”/gi, '$1')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/тісто з італійського борошна вищого ґатунку/i, '')
        .replace(/тісто з борошна вищого ґатунку/i, '')
        .replace(/ковбаски власного приготування/i, 'ковбаски')
        .replace(/соус томатний згідно справжнього італійського рецепту/, 'соус томатний')
        .replace(/домашній твердий сир/i, 'твердий сир')
        .replace(/качина грудка власного копчення/i, 'копчена качина грудка')
        .replace(/балик власного копчення/i, 'копчений балик')
        .replace(/бекон власного копчення/i, 'копчений бекон')
        .replace(/^,/, '')
        .replace(/сир моцарела/i, 'моцарела')
        .replace(/сир пармезан/i, 'пармезан')
        .replace(/сир горгонзола/gi, 'горгондзола')
        .replace(/сир фета/i, 'фета')
        .replace(/томат/, 'помідори')
        .replace(/томати/, 'помідори')
        .replace(/ ,/, ',')
        .trim();

      return capitalize(fixed);
    },
  },
};
