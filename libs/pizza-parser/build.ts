import path from 'path';
import fsp from 'fs/promises';
import { parsePizzas } from '.';
import { Lang, Pizza, WithId, supportedLangs, Translated, WithChanges } from './types/pizza';
import { getTimestamp } from './utils/date';
import { placeholderOrFixed, translate } from './utils/translate';
import { toSha256 } from './utils/crypto';
import { pizzas } from 'pizzas.json';
import { getNotDeepChanges } from './utils/object';

interface TranslatedContent {
  title: string;
  description: string;
  lang: Lang;
}

const OUTPUT_PATH = path.join(process.cwd(), 'pizzas.json');

const writeOutputPizzas = async (pizzas: Translated[], createdAt: number) => {
  const result = { createdAt, pizzas };

  await fsp.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2));
};

const pizzasMap = pizzas.reduce(
  (map, pizza) => map.set(pizza.id, pizza as WithChanges),
  new Map<string, WithChanges>(),
);

const addChanges = (newPizzas: Translated[], discoveredAt: number) => {
  return newPizzas.map((newPizza) => {
    const isFound = pizzasMap.has(newPizza.id);

    if (!isFound) {
      return newPizza;
    }

    const oldPizza = pizzasMap.get(newPizza.id);
    const changesWithoutDiscoveredAt = getNotDeepChanges(oldPizza, newPizza);
    const changes = changesWithoutDiscoveredAt.map((change) => ({ ...change, discoveredAt }));

    const result = { ...newPizza } as WithChanges;

    if (changes.length !== 0) {
      result.changes = [...result.changes, ...changes];
    }

    return result;
  });
};

const addId = (pizzas: Pizza[]): WithId[] => {
  return pizzas.map((pizza) => {
    const { title, link, lang, country, city, size } = pizza;
    const id = toSha256(JSON.stringify({ title, link, lang, country, city, size }));

    return { ...pizza, id };
  });
};

const translatePizza = async ({ title, description, lang: from, ...rest }: WithId) => {
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
  ) as Translated;
};

const translatePizzas = async (pizzas: WithId[]) => {
  return await Promise.all(pizzas.map(translatePizza));
};

const main = async () => {
  const createdAt = getTimestamp();
  const pizzas = await parsePizzas();
  const withId = addId(pizzas);
  const translatedPizzas = await translatePizzas(withId);
  const withChanges = addChanges(translatedPizzas, createdAt);

  await writeOutputPizzas(withChanges, createdAt);
};

main();
