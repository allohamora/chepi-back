import path from 'node:path';
import fsp from 'node:fs/promises';
import { debuglog } from 'node:util';
import { parsePizzas } from '.';
import {
  Lang,
  Pizza,
  WithId,
  supportedLangs,
  Translated,
  WithHistory,
  PizzaJson,
  historyOfChangesWatchKeys,
} from './types/pizza';
import { getTimestamp } from './utils/date';
import { placeholderOrFixed, translate } from './utils/translate';
import { toSha256 } from './utils/crypto';
import { pizzas } from 'pizzas.json';
import { objectDiff, pick } from './utils/object';

const debug = debuglog('pizza-parser:build');

const WRITE_PATH = path.join(process.cwd(), 'pizzas.json');

const writePizzas = async (pizzas: PizzaJson[], updatedAt: number) => {
  const data = { updatedAt, pizzas };

  await fsp.writeFile(WRITE_PATH, JSON.stringify(data, null, 2));
};

const addHistory = (newPizzas: Translated[], detectedAt: number) => {
  const pizzasMap = pizzas.reduce(
    (map, pizza) => map.set(pizza.id, pizza as unknown as PizzaJson),
    new Map<string, PizzaJson>(),
  );

  return newPizzas.map((newPizza) => {
    const isFound = pizzasMap.has(newPizza.id);

    if (!isFound) {
      return newPizza;
    }

    const oldPizza = pizzasMap.get(newPizza.id);
    const diff = objectDiff(pick(oldPizza, historyOfChangesWatchKeys), pick(newPizza, historyOfChangesWatchKeys));
    const historyOfChanges = diff.map(({ key, values }) => ({
      key,
      old: values[0],
      new: values[1],
      detectedAt,
    }));

    const result = { ...newPizza } as WithHistory;

    if (historyOfChanges.length !== 0 || Array.isArray(oldPizza.historyOfChanges)) {
      result.historyOfChanges = [...historyOfChanges, ...(oldPizza.historyOfChanges || [])];
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

  const translateContent = async (to: string) => {
    const translatedTitle = await translate({ text: title, from, to });
    const translatedDescription = await translate({ text: description, from, to });

    return { title: translatedTitle, description: translatedDescription, lang: to as Lang };
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

const PIZZAS_PARALLEL_CHAINS = 15;

const translatePizzas = async (pizzas: WithId[]) => {
  const pieces: WithId[][] = pizzas.reduce(
    (state, pizza, i) => {
      const stateIdx = i % PIZZAS_PARALLEL_CHAINS;

      state[stateIdx].push(pizza);
      return state;
    },
    Array.from({ length: PIZZAS_PARALLEL_CHAINS }, () => []),
  );

  const pieceToChain = async (piece: WithId[]) => {
    return await piece.reduce((chain, pizza) => {
      return chain.then(async (state) => {
        state.push(await translatePizza(pizza));

        return state;
      });
    }, Promise.resolve([] as Translated[]));
  };

  const pizzasNested = await Promise.all(pieces.map(pieceToChain));

  return pizzasNested.flat(1);
};

const main = async () => {
  debug('build start');

  debug('get updatedAt');
  const updatedAt = getTimestamp();

  debug('parse pizzas');
  const pizzas = await parsePizzas();

  debug('add id to pizzas');
  const withId = addId(pizzas);

  debug('translate pizzas');
  const translated = await translatePizzas(withId);

  debug('add historyOfChanges to pizzas');
  const withHistory = addHistory(translated, updatedAt);

  debug('write pizzas.json');
  await writePizzas(withHistory, updatedAt);

  debug('build finish');
};

main();
