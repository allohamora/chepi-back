import { HttpRequest } from 'libs/http';
import { Cache } from './cache';

interface TranslateOptions {
  from: string;
  to: string;
  text: string;
}

const LIBRE_URL = 'http://localhost:5000/translate';
const cache = new Cache('translate');

export const translate = cache.decorator(async ({ from, to, text }: TranslateOptions) => {
  const {
    data: { translatedText },
  } = await new HttpRequest(LIBRE_URL)
    .post()
    .jsonBody({ q: text, source: from, target: to })
    .returnType('json')
    .request<{ translatedText: string }>();

  return translatedText;
});
