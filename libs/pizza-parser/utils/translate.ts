import freeGoogleTranslate from '@vitalets/google-translate-api';
import { Cache } from './cache';
import { HttpsProxyAgent } from 'hpagent';
import { HTTP_PROXY_URL } from './config';
import type { Options } from 'got';
import { capitalize } from './string';
import { isomorphicMemoryFsStrategy } from './cache/isomorphic-in-memory-fs.strategy';

interface TranslateOptions {
  from: string;
  to: string;
  text: string;
}

const cache = new Cache(isomorphicMemoryFsStrategy('translate'));

interface FixedTranslateOptions {
  from: string;
  to: string;
}

type FixedTranslate = (url: string, options: FixedTranslateOptions, gotOptions: Options) => Promise<{ text: string }>;

const fixedTranslate: FixedTranslate = (url, options, gotOptions) => {
  return (freeGoogleTranslate as unknown as FixedTranslate)(url, options, gotOptions);
};

export const translate = cache.decorator(async ({ from, to, text }: TranslateOptions) => {
  const { text: data } = await fixedTranslate(text, { from, to }, {
    agent: { https: new HttpsProxyAgent({ proxy: HTTP_PROXY_URL }) },
  } as Options);

  return data;
});

export const TEXT_PLACEHOLDER = '-';

const fixTranslationErrors = (text: string) => {
  const withoutErrors = text
    .replace(/ ?,/g, ',')
    .replace(/ ?-/g, '-')
    .replace(/« ?(.+?) ?»/g, '«$1»')
    .replace(/" ?(.+?) ?"/g, '"$1"');

  return capitalize(withoutErrors);
};

export const placeholderOrFixed = (text: string) => {
  return text.length === 0 ? TEXT_PLACEHOLDER : fixTranslationErrors(text);
};
