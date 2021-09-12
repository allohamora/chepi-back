import path from 'path';
import fsp from 'fs/promises';
import { parsePizzas } from '.';
import { Pizza, supportedLangs, TranslatedPizza, TranslatedPizzaWithId } from './types/pizza';
import { nanoid } from 'nanoid';
import { getTimestamp } from './utils/date';
import { translate } from './utils/translate';

const OUTPUT_PATH = path.join(process.cwd(), 'pizzas.json');

const writeOutputPizzas = async (pizzas: TranslatedPizza[]) => {
  const timestamp = getTimestamp();
  const result = { timestamp, pizzas };

  await fsp.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2));
};

const addId = (pizzas: TranslatedPizza[]): TranslatedPizzaWithId[] => {
  return pizzas.map((pizza) => ({ ...pizza, id: nanoid() }));
};

const translatePizzas = async (pizzas: Pizza[]) => {
  const requests = pizzas.map((pizza) => async () => {
    const { title, description, lang: from, ...rest } = pizza;

    const restLangs = supportedLangs.filter((lang) => lang !== from);

    const variants = await Promise.all(
      restLangs.map(async (to) => {
        const translatedTitle = await translate({ text: title, from, to });
        const translatedDescription = await translate({ text: description, from, to });

        return { translatedTitle, translatedDescription, lang: to };
      }),
    );

    const translatedPizza = { ...rest } as TranslatedPizza;

    [{ translatedTitle: title, translatedDescription: description, lang: from }, ...variants].forEach(
      ({ translatedTitle, translatedDescription, lang }) => {
        translatedPizza[`${lang}_title`] = translatedTitle;
        translatedPizza[`${lang}_description`] = translatedDescription;
      },
    );

    return translatedPizza;
  });

  const translatedPizzas = await requests.reduce((chain, request) => {
    return chain.then(async (values) => [...values, await request()]);
  }, Promise.resolve([]));

  return translatedPizzas as TranslatedPizza[];
};

const main = async () => {
  const pizzas = await parsePizzas();
  const translatedPizzas = await translatePizzas(pizzas);
  const withId = addId(translatedPizzas);

  await writeOutputPizzas(withId);
};

main();
