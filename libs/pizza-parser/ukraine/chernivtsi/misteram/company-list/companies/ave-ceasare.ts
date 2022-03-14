import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';

export const aveCeasare: Company = {
  slug: 'aveceasare',
  id: 2633,
  categories: [{ id: 32894, size: 30, slug: 'pizza30' }],
  normalize: {
    title: (title) => {
      const fixed = title
        .replace(/піца/i, '')
        .replace(/«(.+?)»/, '$1')
        .replace(/“(.+?)”/, '$1')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/тісто з італійського борошна вищого ґатунку, /i, '')
        .replace(/Тісто з борошна вищого ґатунку, /i, '')
        .replace(/соус томатний згідно справжнього італійського рецепту/i, 'соус томатний')
        .replace(/качина грудка власного копчення/i, 'копчена качина грудка')
        .replace(/балик власного копчення/i, 'копчений балик')
        .replace(/баклажан у фритюрі з часником та орегано/i, 'баклажан у фритюрі, часник, орегано')
        .replace(/ковбаски власного приготування/i, 'ковбаски')
        .replace(/бекон власного копчення/i, 'копчений бекон')
        .replace(/вершковий соус з крем-сиром/i, 'вершковий соус')
        .replace(/сир Філадельфія/i, 'сир Філадельфія')
        .replace(/сир Моцарела/i, 'моцарела')
        .replace(/сир Пармезан/i, 'пармезан')
        .replace(/сир Горгонзола/i, 'горгонзола')
        .replace(/сир Фета/i, 'фета')
        .replace(/домашній твердий сир/i, 'сир твердий')
        .replace(/томати/, 'помідори')
        .replace(/солодкий маринований перець Пеперончіно/i, 'солодкий маринований перець Пеперончіно')
        .replace(/ ,/, ',')
        .trim();

      return capitalize(fixed);
    },
  },
};
