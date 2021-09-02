import path from 'path';
import fsp from 'fs/promises';
import translate from '@iamtraction/google-translate';
import { parsePizzas } from '.';
import { Pizza, Lang, supportedLangs, TranslatedPizza } from './types/pizza';

const getTimestamp = () => Math.round(new Date().getTime() / 1000);

type DataChunk = [string, string, number];
type TranslateDataState = Record<string, DataChunk[]>;
type Tranlated = {
  from: Lang;
  to: Lang;
  dataChunks: DataChunk[];
}[];

const OUTPUT_PATH = path.join(process.cwd(), 'pizzas.json');
const LEFT_SYMBOL = '_____';
const RIGHT_SYMBOL = '_____';

const serializeData = (data: string | number) => `${LEFT_SYMBOL}${data}${RIGHT_SYMBOL}`;
const serialize = (dataToTranslate: [string, string, number][]) => {
  return dataToTranslate.map((data) => data.map(serializeData).join(' ')).join('\n');
};

const deserialize = (serializedDataToTranslate: string) => {
  const chunks = serializedDataToTranslate.match(new RegExp(`${LEFT_SYMBOL}.+?${RIGHT_SYMBOL}`, 'g'));
  const result = [];

  for (let index = 0; index < chunks.length; index++) {
    const targetIndex = Math.floor(index / 3);

    if (result[targetIndex] === undefined) {
      result[targetIndex] = [];
    }

    const target = result[targetIndex];
    const chunk = chunks[index];
    const stringData = chunk.replace(LEFT_SYMBOL, '').replace(RIGHT_SYMBOL, '').trim();

    if ((index + 1) % 3 === 0) {
      target.push(Number(stringData));
    } else {
      target.push(stringData);
    }
  }

  return result as DataChunk[];
};

const createTranslateDataState = (pizzas: Pizza[]) => {
  const translateData: TranslateDataState = pizzas.reduce((state, { title, description, lang }, index) => {
    if (!state[lang]) {
      state[lang] = [];
    }

    state[lang].push([title, description, index]);

    return state;
  }, {});

  const langs = Object.keys(translateData) as Lang[];

  return { translateData, langs };
};

const translateState = async (translateData: TranslateDataState, langs: Lang[]) => {
  const translated = await Promise.all(
    langs.map(async (from) => {
      const dataToTranslate = translateData[from];

      const toList = supportedLangs.filter((to) => to !== from);
      const serialized = serialize(dataToTranslate);

      const data = await Promise.all(
        toList.map(async (to) => {
          const { text } = await translate(serialized, { from, to });

          const dataChunks = deserialize(text);

          return { from, to, dataChunks };
        }),
      );

      return data;
    }),
  );

  return translated.flat(1);
};

const combineTranslated = (pizzas: Pizza[], tranlsated: Tranlated) => {
  const copy = [...pizzas];

  tranlsated.forEach(({ to, dataChunks }) => {
    dataChunks.forEach(([title, description, index]) => {
      const pizza = copy[index];

      pizza[`${to}_title`] = title;
      pizza[`${to}_description`] = description;
    });
  });

  copy.forEach(({ title, description, lang }, index) => {
    const pizza = copy[index];

    pizza[`${lang}_title`] = title;
    pizza[`${lang}_description`] = description;

    delete pizza.title;
    delete pizza.description;
  });

  return copy as unknown[] as TranslatedPizza[];
};

const writeOutputPizzas = async (pizzas: TranslatedPizza[]) => {
  const timestamp = getTimestamp();
  const result = { timestamp, pizzas };

  await fsp.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2));
};

const main = async () => {
  const pizzas = await parsePizzas();

  const { translateData, langs } = createTranslateDataState(pizzas);
  const translated = await translateState(translateData, langs);
  const translatedPizzas = combineTranslated(pizzas, translated);

  await writeOutputPizzas(translatedPizzas);
};

main();
