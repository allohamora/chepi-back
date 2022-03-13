import { capitalize } from 'libs/pizza-parser/utils/string';

export const removePizzaAndDoubleQuotes = (value: string) => {
  const fixed = value
    .replace(/піца/i, '')
    .replace(/"(.+?)"/, '$1')
    .trim();

  return capitalize(fixed);
};
