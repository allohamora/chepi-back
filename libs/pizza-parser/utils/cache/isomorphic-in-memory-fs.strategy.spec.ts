import { FsStrategy } from './fs.strategy';
import { InMemoryFsStrategy } from './in-memory-fs.strategy';
import { isomorphicMemoryFsStrategy } from './isomorphic-in-memory-fs.strategy';

jest.mock('./fs.strategy');
jest.mock('./in-memory-fs.strategy');

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  jest.clearAllMocks();
});

describe('isomorphicMemoryFsStrategy', () => {
  const cacheName = 'test';

  test('in test environement return FsStrategy', () => {
    isomorphicMemoryFsStrategy(cacheName);

    expect(FsStrategy).toHaveBeenCalledTimes(1);
    expect(FsStrategy).toBeCalledWith(cacheName);

    expect(InMemoryFsStrategy).not.toBeCalled();
  });

  test('in not test environment return InMemoryFsStrategy', () => {
    process.env.NODE_ENV = 'development';
    isomorphicMemoryFsStrategy(cacheName);

    expect(InMemoryFsStrategy).toBeCalledTimes(1);
    expect(InMemoryFsStrategy).toBeCalledWith(cacheName);

    expect(FsStrategy).not.toBeCalled();
  });
});
