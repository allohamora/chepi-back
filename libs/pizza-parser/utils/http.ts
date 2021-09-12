import { request } from 'undici';
import { Cache } from './cache';

const cache = new Cache('http');

const getTextOriginal = async (url: string) => {
  const { body } = await request(url);

  return await body.text();
};

const getCacheOrText = async (url: string) => {
  await cache.createCacheDirIfNotExists();

  if (await cache.has(url)) {
    return await cache.get(url);
  }

  const text = await getTextOriginal(url);
  await cache.set(url, text);

  return text;
};

export const getText = process.env.NODE_ENV === 'production' ? getTextOriginal : getCacheOrText;

export const getJSON = async <T extends unknown>(url: string) => {
  const value = await getText(url);
  return JSON.parse(value) as T;
};
