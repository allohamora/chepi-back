import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { serialize, deserialize } from 'node:v8';
import { CACHE_DIR } from './path.const';
import { CacheStrategy } from './strategy';
import { pathExists } from '../fs';

const WRITE_TIMEOUT = 10000;

enum InitStatus {
  Loaded,
  Loading,
  Waiting,
}

export class MemoryFsStrategy implements CacheStrategy {
  private cacheFileName: string;
  private cachePath: string;

  private state: Record<string, string> = {};
  private initStatus: InitStatus = InitStatus.Waiting;
  private initPromise: Promise<void>;
  private writeTimeout: NodeJS.Timeout;

  constructor(cacheName: string) {
    this.cacheFileName = `${cacheName}.cache`;
    this.cachePath = resolve(CACHE_DIR, this.cacheFileName);
  }

  private async initState() {
    if (!(await pathExists(this.cachePath))) {
      return;
    }

    const cacheBuffer = await readFile(this.cachePath);
    this.state = deserialize(cacheBuffer);
  }

  private async initStateIfNeed() {
    if (this.initStatus === InitStatus.Loaded) {
      return;
    } else if (this.initStatus === InitStatus.Loading) {
      return this.initPromise;
    }

    this.initPromise = Promise.resolve(this.initState())
      .then(() => console.log(this.state))
      .then(() => {
        this.initStatus = InitStatus.Loaded;
      });

    this.initStatus = InitStatus.Loading;

    return this.initPromise;
  }

  private saveState() {
    clearTimeout(this.writeTimeout);
    setTimeout(async () => {
      const buffer = serialize(this.state);

      await mkdir(CACHE_DIR, { recursive: true });
      await writeFile(this.cachePath, buffer);
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

    this.state[key] = value;

    this.saveState();
  }
}
