import { writeFile, readFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { CACHE_DIR } from './path.const';
import { CacheStrategy } from './strategy';
import { pathExists } from '../fs';

export const WRITE_TIMEOUT = 10000;

enum InitStatus {
  Loaded,
  Loading,
  Waiting,
}

export class InMemoryFsStrategy implements CacheStrategy {
  private cacheDir: string;

  private state: Record<string, string> = {};
  private initStatus: InitStatus = InitStatus.Waiting;
  private initPromise: Promise<void>;
  private writeTimeout: NodeJS.Timeout;

  constructor(cacheName: string) {
    this.cacheDir = resolve(CACHE_DIR, cacheName);
  }

  private hashKey(key: string) {
    return createHash('sha256').update(key).digest('hex');
  }

  private getFilePath(hashedKey: string) {
    return resolve(this.cacheDir, hashedKey);
  }

  private async initState() {
    if (!(await pathExists(this.cacheDir))) {
      return;
    }

    const hashedKeys = await readdir(this.cacheDir);

    await Promise.all(
      hashedKeys.map(async (hashedKey) => {
        const filePath = resolve(this.cacheDir, hashedKey);
        const value = await readFile(filePath, 'utf-8');

        this.state[hashedKey] = value;
      }),
    );
  }

  private async initStateIfNeed() {
    if (this.initStatus === InitStatus.Loaded) {
      return;
    } else if (this.initStatus === InitStatus.Loading) {
      return this.initPromise;
    }

    this.initPromise = Promise.resolve(this.initState()).then(() => {
      this.initStatus = InitStatus.Loaded;
    });

    this.initStatus = InitStatus.Loading;

    return this.initPromise;
  }

  private saveState() {
    clearTimeout(this.writeTimeout);

    this.writeTimeout = setTimeout(async () => {
      await mkdir(CACHE_DIR, { recursive: true });

      const hashedKeys = Object.keys(this.state);

      await Promise.all(
        hashedKeys.map(async (hashedKey) => {
          const filePath = this.getFilePath(hashedKey);

          await writeFile(filePath, this.state[hashedKey], 'utf-8');
        }),
      );
    }, WRITE_TIMEOUT);
  }

  public async has(key: string) {
    await this.initStateIfNeed();

    return key in this.state;
  }

  public async get(key: string) {
    await this.initStateIfNeed();

    return this.state[key];
  }

  public async set(key: string, value: string) {
    await this.initStateIfNeed();

    const hashedKey = this.hashKey(key);

    this.state[hashedKey] = value;

    this.saveState();
  }
}
