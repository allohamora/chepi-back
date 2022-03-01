import { CacheStrategy } from './strategy';

export class InMemoryStrategy implements CacheStrategy {
  private state: Record<string, string> = {};

  public has(key: string) {
    return key in this.state;
  }

  public get(key: string) {
    return this.state[key];
  }

  public set(key: string, value: string) {
    this.state[key] = value;
  }
}
