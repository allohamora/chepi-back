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
}

const cache = new Cache(new FsStrategy('translate'));

export const translate = cache.decorator(async ({ from, to, text }: TranslateOptions) => {
  const res = await freeGoogleTranslate(
    text,
    { from, to },
    {
      agent: { https: new HttpsProxyAgent({ proxy: HTTP_PROXY_URL }) },
    },
  );

  return res.text;
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
