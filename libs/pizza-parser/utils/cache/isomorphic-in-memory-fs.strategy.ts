import { FsStrategy } from './fs.strategy';
import { InMemoryFsStrategy } from './in-memory-fs.strategy';
import { CacheStrategy } from './strategy';

/**
 * if runs in test environment returns strategy which support multitrheading else returns single thread strategy
 */
export const isomorphicMemoryFsStrategy = (cacheName: string): CacheStrategy => {
  if (process.env.NODE_ENV === 'test') {
    return new FsStrategy(cacheName);
  } else {
    return new InMemoryFsStrategy(cacheName);
  }
};
