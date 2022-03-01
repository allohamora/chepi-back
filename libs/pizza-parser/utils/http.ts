import { HttpRequest } from 'libs/http';
import { MemoryFsStrategy } from './cache/memory-fs.strategy';
import { Cache } from './cache';

const cache = new Cache(new MemoryFsStrategy('http'));

export const getText = cache.decorator(async (url: string) => {
  const { data } = await new HttpRequest(url).returnType('text').request<string>();

  return data;
});

export const getJSON = async <T>(url: string) => {
  const text = await getText(url);
  const parsed = JSON.parse(text);

  return parsed as T;
};
