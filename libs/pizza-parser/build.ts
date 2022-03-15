import path from 'node:path';
import fsp from 'node:fs/promises';
import { parsePizzas } from '.';
import {
  Pizza,
  supportedLangs,
  TranslatedContent,
  PizzaJson,
  historyOfChangesWatchKeys,
  PizzaJsonWithoutHistory,
  Lang,
} from './types/pizza';
import { getTimestamp } from './utils/date';
import { placeholderOrFixed, translate } from './utils/translate';
import { toSha256 } from './utils/crypto';
import { pizzas } from 'pizzas.json';
import { objectDiff, omit, pick } from './utils/object';

const WRITE_PATH = path.join(process.cwd(), 'pizzas.json');

const writePizzas = async (pizzas: PizzaJson[], updatedAt: number) => {
  const data = { updatedAt, pizzas };

  await fsp.writeFile(WRITE_PATH, JSON.stringify(data, null, 2));
};

const pizzasMap = pizzas.reduce(
  (map, pizza) => map.set(pizza.id, pizza as unknown as PizzaJson),
  new Map<string, PizzaJson>(),
);

const getHistoryOfChanges = (newPizza: PizzaJsonWithoutHistory, detectedAt: number) => {
  const isFound = pizzasMap.has(newPizza.id);

  if (!isFound) {
    return;
  }

  const oldPizza = pizzasMap.get(newPizza.id);
  const diff = objectDiff(pick(oldPizza, historyOfChangesWatchKeys), pick(newPizza, historyOfChangesWatchKeys));
  const newHistoryOfChanges = diff.map(({ key, values }) => ({
    key,
    old: values[0],
    new: values[1],
    detectedAt,
  }));

  const historyOfChanges = [...newHistoryOfChanges, ...(oldPizza.historyOfChanges || [])];

  if (historyOfChanges.length === 0) {
    return;
  }

  return historyOfChanges;
};

const getId = ({ title, link, lang, country, city, size }: Pizza) => {
  return toSha256(JSON.stringify({ title, link, lang, country, city, size }));
};

const getTranslatedContent = async ({ title, description, lang: from }) => {
  const restLangs = supportedLangs.filter((lang) => lang !== from);

  const toContent = (title: string, description: string, lang: Lang) => ({
    [`${lang}_title`]: placeholderOrFixed(title),
    [`${lang}_description`]: placeholderOrFixed(description),
  });

  const restContent = await Promise.all(
    restLangs.map(async (to) => {
      const translatedTitle = await translate({ text: title, from, to });
      const translatedDescription = await translate({ text: description, from, to });

      return toContent(translatedTitle, translatedDescription, to);
    }),
  );

  const content = [toContent(title, description, from), ...restContent];

  return content.reduce((state, current) => ({ ...state, ...current }), {} as TranslatedContent) as TranslatedContent;
};

const buildPizza = async (pizza: Pizza, updatedAt: number): Promise<PizzaJson> => {
  const id = getId(pizza);
  const translatedContent = await getTranslatedContent(pizza);
  const withoutHistory = { id, ...omit(pizza, ['title', 'description']), ...translatedContent };
  const historyOfChanges = getHistoryOfChanges(withoutHistory, updatedAt);

  return { ...withoutHistory, historyOfChanges };
};

const PIZZAS_PARALLEL_CHAINS = 15;

type PizzasChain = Promise<PizzaJson[]>;

const buildPizzas = async (pizzas: Pizza[], updatedAt: number): Promise<PizzaJson[]> => {
  const pieces: Pizza[][] = pizzas.reduce(
    (state, pizza, i) => {
      const stateIdx = i % PIZZAS_PARALLEL_CHAINS;
      state[stateIdx].push(pizza);

      return state;
    },
    Array.from({ length: PIZZAS_PARALLEL_CHAINS }, () => []),
  );

  const toChain = async (chain: PizzasChain, pizza: Pizza) => {
    return await chain.then(async (state) => {
      const builded = await buildPizza(pizza, updatedAt);
      state.push(builded);

      return state;
    });
  };

  const pieceToChain = async (piece: Pizza[]) => {
    return await piece.reduce(toChain, Promise.resolve([] as PizzaJson[]));
  };

  const pizzasPieces = await Promise.all(pieces.map(pieceToChain));

  return pizzasPieces.flat(1);
};

const main = async () => {
  const updatedAt = getTimestamp();
  const pizzas = await parsePizzas();
  const builded = await buildPizzas(pizzas, updatedAt);
  await writePizzas(builded, updatedAt);
};

main();
