import { FsStrategy } from './fs.strategy';
import { MemoryFsStrategy } from './memory-fs.strategy';
import { CacheStrategy } from './strategy';

export const isomorphicMemoryFsStrategy = (cacheName: string): CacheStrategy => {
  if (process.env.NODE_ENV === 'test') {
    return new FsStrategy(cacheName);
  } else {
    return new MemoryFsStrategy(cacheName);
  }
};
