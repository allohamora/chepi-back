import fsp from 'fs/promises';
import path from 'path';
import { request } from 'undici';

const CACHE_PATH = path.join(__dirname, '..', '.http-cache');
const getFilePath = (fileName: string) => path.join(CACHE_PATH, fileName);

const getStatOrFalse = async (checkPath: string) => {
  try {
    return await fsp.stat(checkPath);
  } catch (error) {
    return false;
  }
};

const createCacheDirIfNotExists = async () => {
  const stat = await getStatOrFalse(CACHE_PATH);

  if (stat !== false) return false;

  await fsp.mkdir(CACHE_PATH);

  return true;
};

const isExistsInCache = async (fileName: string) => {
  const stat = await getStatOrFalse(getFilePath(fileName));

  if (stat === false) return false;

  return stat.isFile();
};

const getFileName = (url: string) => Buffer.from(url, 'utf-8').toString('hex');

const getFromCache = async (fileName: string) => {
  const file = await fsp.readFile(getFilePath(fileName), 'utf-8');

  return file;
};

const setToCache = async (fileName: string, text: string) => {
  await fsp.writeFile(getFilePath(fileName), text, 'utf-8');
};

const getTextOriginal = async (url: string) => {
  const { body } = await request(url);

  return await body.text();
};

const getCacheOrText = async (url: string) => {
  const fileName = getFileName(url);

  await createCacheDirIfNotExists();

  if (await isExistsInCache(fileName)) {
    return await getFromCache(fileName);
  }

  const text = await getTextOriginal(url);
  await setToCache(fileName, text);
  return text;
};

export const getText = process.env.NODE_ENV === 'production' ? getTextOriginal : getCacheOrText;
export const getJSON = async <T extends unknown>(url: string) => {
  const value = await getText(url);
  return JSON.parse(value) as T;
};
