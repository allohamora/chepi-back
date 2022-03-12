import { setTimeout as delay } from 'node:timers/promises';
import { debuglog } from 'node:util';
import freeGoogleTranslate from '@vitalets/google-translate-api';
import { Cache } from './cache';
import { HttpsProxyAgent } from 'hpagent';
import { HTTP_PROXY_URL } from './config';
import { capitalize } from './string';
import { FsStrategy } from './cache/fs.strategy';

interface TranslateOptions {
  from: string;
  to: string;
  text: string;
  timeout?: number;
}

const cache = new Cache(new FsStrategy('translate'));
const debug = debuglog('pizza-parser:translate');

const TRANSLATE_ERROR_TIMEOUT_STEP = 100;

export const translate = cache.decorator(
  async ({ from, to, text, timeout = TRANSLATE_ERROR_TIMEOUT_STEP }: TranslateOptions) => {
    try {
      const res = await freeGoogleTranslate(
        text,
        { from, to },
        {
          agent: { https: new HttpsProxyAgent({ proxy: HTTP_PROXY_URL }) },
        },
      );

      return res.text;
    } catch (error) {
      debug('translate-error: %o', { message: error.message, from, to, text, timeout });

      await delay(timeout);
      return await translate({ from, to, text, timeout: timeout * 2 });
    }
  },
);

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
