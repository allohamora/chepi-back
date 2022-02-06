import path from 'path';
import fsp from 'fs/promises';
import { parsePizzas } from '.';
import { Lang, Pizza, supportedLangs, TranslatedPizza, TranslatedPizzaWithId } from './types/pizza';
import { getTimestamp } from './utils/date';
import { placeholderOrFixed, translate } from './utils/translate';
import { toSha256 } from './utils/crypto';

interface TranslatedContent {
  title: string;
  description: string;
  lang: Lang;
}

const OUTPUT_PATH = path.join(process.cwd(), 'pizzas.json');

const writeOutputPizzas = async (pizzas: TranslatedPizza[]) => {
  const timestamp = getTimestamp();
  const result = { timestamp, pizzas };

  await fsp.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2));
};

const addId = (pizzas: TranslatedPizza[]): TranslatedPizzaWithId[] => {
  return pizzas.map((pizza) => ({ ...pizza, id: toSha256(JSON.stringify(pizza)) }));
};

const translatePizza = async ({ title, description, lang: from, ...rest }: Pizza) => {
  const restLangs = supportedLangs.filter((lang) => lang !== from);

  const translateContent = async (to: string): Promise<TranslatedContent> => {
    try {
      const translatedTitle = await translate({ text: title, from, to });
      const translatedDescription = await translate({ text: description, from, to });

      return { title: translatedTitle, description: translatedDescription, lang: to as Lang };
    } catch (error) {
      if ('gotOptions' in error) {
        return await translateContent(to);
      }

      throw error;
    }
  };

  const translatedContent = await Promise.all(restLangs.map(translateContent));
  const content = [{ title, description, lang: from }, ...translatedContent];

  return content.reduce(
    (pizza, { title, description, lang }) => {
      pizza[`${lang}_title`] = placeholderOrFixed(title);
      pizza[`${lang}_description`] = placeholderOrFixed(description);

      return pizza;
    },
    { ...rest },
  ) as TranslatedPizza;
};

const translatePizzas = async (pizzas: Pizza[]) => {
  return await Promise.all(pizzas.map(translatePizza));
};

const main = async () => {
  const pizzas = await parsePizzas();
  const translatedPizzas = await translatePizzas(pizzas);
  const withId = addId(translatedPizzas);

  await writeOutputPizzas(withId);
};

main();
