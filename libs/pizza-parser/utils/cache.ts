import { resolve } from 'path';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { pathExists } from './fs';
import { createHash } from 'crypto';

export class Cache {
  private cacheBaseDir = resolve(__dirname, '../', '.cache');
  private cacheDir: string;

  constructor(cacheName: string) {
    this.cacheDir = resolve(this.cacheBaseDir, cacheName);
  }

  public async createCacheDirIfNotExists() {
    const isExists = await pathExists(this.cacheDir);

    if (isExists) return;

    await mkdir(this.cacheDir, { recursive: true });
  }

  private getFileNameAndPath(key: string) {
    const fileName = createHash('sha256').update(key).digest('hex');
    const filePath = resolve(this.cacheDir, fileName);

    return { fileName, filePath };
  }

  public async has(key: string) {
    const { filePath } = this.getFileNameAndPath(key);

    return await pathExists(filePath);
  }

  public async get(key: string) {
    const { filePath } = this.getFileNameAndPath(key);

    const buffer = await readFile(filePath);

    return buffer.toString('utf-8');
  }

  public async set(key: string, value: string) {
    const { filePath } = this.getFileNameAndPath(key);

    await writeFile(filePath, value, 'utf-8');
  }
}
