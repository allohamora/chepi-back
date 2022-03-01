export interface CacheStrategy {
  set: (key: string, value: string) => Promise<void> | void;
  get: (key: string) => Promise<string> | string;
  has: (key: string) => Promise<boolean> | boolean;
}
