import { HttpRequest } from 'libs/http';
import { Cache } from './cache';
import { FsStrategy } from './cache/fs.strategy';

export const cache = new Cache(new FsStrategy('http'));

export const getText = cache.decorator(async (url: string) => {
  const res = await new HttpRequest(url).returnType('text').request<string>();

  return res.data;
});

export const getJSON = async <T>(url: string) => {
  const text = await getText(url);
  const parsed = JSON.parse(text);

  return parsed as T;
};
