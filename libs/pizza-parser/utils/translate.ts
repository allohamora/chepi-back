import freeGoogleTranslate from '@vitalets/google-translate-api';
import { Cache } from './cache';
import { HttpsProxyAgent } from 'hpagent';
import { HTTP_PROXY_URL } from './config';
import type { Options } from 'got';

interface TranslateOptions {
  from: string;
  to: string;
  text: string;
}

const cache = new Cache('translate');

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
