import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company } from '../types';
import { removePizzaAndDoubleQuotes } from '../utils';

export const theSad: Company = {
  slug: 'thesad',
  pizzaCompany: {
    en_company: 'The Sad',
    ru_company: 'The Сад',
    uk_company: 'The Сад',
  },
  id: 2096,
  categories: [
    { id: 26669, size: null, slug: 'pizza' },
    { id: 32975, size: 50, slug: 'pizza50' },
  ],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/марко поло/i, 'Марко Поло')
        .replace(/ді поло/i, 'Ді Поло')
        .replace(/мі аморе/i, 'Мі Аморе')
        .replace(/ді сальмоне/i, 'Ді Сальмоне')
        .replace(/прошуто ді парма/i, 'прошуто Ді Парма')
        .replace(/фрута ді маре/i, 'Фрута Ді Маре')
        .replace(/ді сальмоне/i, 'Ді Сальмоне')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/моцарелла/, 'моцарела')
        .replace(/парма/, 'прошуто "Парма"')
        .replace(/моцарелла буфало/, 'моцарела Буфало')
        .replace(/моцарела буффало/, 'моцарела Буфало')
        .replace(/соус маринара/, 'соус "Маринара"')
        .replace(/соус песто/, 'соус Песто')
        .replace(/соус цезар/, 'соус Цезар')
        .replace(/сир фета/, 'фета')
        .replace(/чері/, 'помідори чері')
        .replace(/"(.+?)"/g, '$1')
        .replace(/шампіньйони/i, 'печериці')
        .replace(/томати/i, 'помідори')
        .replace(/папероні/i, 'пепероні')
        .trim();

      return capitalize(fixed);
    },
  },
};
