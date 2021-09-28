import path from 'path';
import fsp from 'fs/promises';
import { parsePizzas } from '.';
import { Pizza, supportedLangs, TranslatedPizza, TranslatedPizzaWithId } from './types/pizza';
import { nanoid } from 'nanoid';
import { getTimestamp } from './utils/date';
import { translate } from './utils/translate';
import { capitalize } from './utils/string';

const OUTPUT_PATH = path.join(process.cwd(), 'pizzas.json');

const writeOutputPizzas = async (pizzas: TranslatedPizza[]) => {
  const timestamp = getTimestamp();
  const result = { timestamp, pizzas };

  await fsp.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2));
};

const addId = (pizzas: TranslatedPizza[]): TranslatedPizzaWithId[] => {
  return pizzas.map((pizza) => ({ ...pizza, id: nanoid() }));
};

const TEXT_PLACEHOLDER = '-';
const fixTranslationErrors = (text: string) =>
  capitalize(
    text
      .replace(/ ?,/g, ',')
      .replace(/ ?-/g, '-')
      .replace(/« ?(.+?) ?»/g, '«$1»')
      .replace(/" ?(.+?) ?"/g, '"$1"'),
  );

const translatePizzas = async (pizzas: Pizza[]) => {
  const translatedPizzas = await Promise.all(
    pizzas.map(async (pizza) => {
      const { title, description, lang: from, ...rest } = pizza;

      const restLangs = supportedLangs.filter((lang) => lang !== from);

      const variants = await Promise.all(
        restLangs.map(async function translateContent(to) {
          try {
            const translatedTitle = await translate({ text: title, from, to });
            const translatedDescription = await translate({ text: description, from, to });

            return { translatedTitle, translatedDescription, lang: to };
          } catch (error) {
            if ('gotOptions' in error) {
              return await translateContent(to);
            }

            throw error;
          }
        }),
      );

      const translatedPizza = { ...rest } as TranslatedPizza;

      [{ translatedTitle: title, translatedDescription: description, lang: from }, ...variants].forEach(
        ({ translatedTitle, translatedDescription, lang }) => {
          translatedPizza[`${lang}_title`] =
            translatedTitle.length === 0 ? TEXT_PLACEHOLDER : fixTranslationErrors(translatedTitle);
          translatedPizza[`${lang}_description`] =
            translatedDescription.length === 0 ? TEXT_PLACEHOLDER : fixTranslationErrors(translatedDescription);
        },
      );

      return translatedPizza;
    }),
  );

  return translatedPizzas;
};

const main = async () => {
  const pizzas = await parsePizzas();
  const translatedPizzas = await translatePizzas(pizzas);
  const withId = addId(translatedPizzas);

  await writeOutputPizzas(withId);
};

main();
