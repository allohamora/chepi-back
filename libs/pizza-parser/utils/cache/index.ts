import { CacheStrategy } from './strategy';

export class Cache {
  constructor(private strategy: CacheStrategy) {}

  public async has(key: string) {
    return await Promise.resolve(this.strategy.has(key));
  }

  public async get(key: string) {
    return await Promise.resolve(this.strategy.get(key));
  }

  public async set(key: string, value: string) {
    return await Promise.resolve(this.strategy.set(key, value));
  }

  public async setStrategy(strategy: CacheStrategy) {
    this.strategy = strategy;
  }

  public decorator<T extends (...args: unknown[]) => string | Promise<string>>(fun: T) {
    return async (...args: Parameters<T>) => {
      const key = JSON.stringify(args);

      if (await this.strategy.has(key)) {
        return await this.strategy.get(key);
      }

      const data = await fun(...args);
      await this.strategy.set(key, data);

      return data;
    };
  }
}
