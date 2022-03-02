import { resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathExists } from '../fs';
import { CacheStrategy } from './strategy';
import { CACHE_DIR } from './path.const';

export class FsStrategy implements CacheStrategy {
  private cacheDir: string;

  /**
   * supports multi-threading
   */
  constructor(cacheName: string) {
    this.cacheDir = resolve(CACHE_DIR, cacheName);
  }

  private async createCacheDirIfNotExists() {
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
    await this.createCacheDirIfNotExists();
    const { filePath } = this.getFileNameAndPath(key);

    return await pathExists(filePath);
  }

  public async get(key: string) {
    await this.createCacheDirIfNotExists();

    const { filePath } = this.getFileNameAndPath(key);

    const buffer = await readFile(filePath);
    return buffer.toString('utf-8');
  }

  public async set(key: string, value: string) {
    await this.createCacheDirIfNotExists();

    const { filePath } = this.getFileNameAndPath(key);

    await writeFile(filePath, value, 'utf-8');
  }
}
