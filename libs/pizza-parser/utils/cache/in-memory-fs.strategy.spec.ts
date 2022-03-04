import * as fsUtils from '../fs';
import fsp from 'node:fs/promises';
import v8 from 'node:v8';
import { InMemoryFsStrategy, WRITE_TIMEOUT } from './in-memory-fs.strategy';
import { resolve } from 'node:path';
import { CACHE_DIR } from './path.const';

jest.mock('../fs');
jest.mock('node:fs/promises');
jest.mock('node:v8');

const fsUtilsMocked = jest.mocked(fsUtils);
const fspMocked = jest.mocked(fsp);
const v8Mocked = jest.mocked(v8);

jest.setTimeout(WRITE_TIMEOUT * 2);

beforeEach(() => {
  jest.clearAllMocks();
});

const setFactory = (strategy: InMemoryFsStrategy) => (key: string, value: string) => {
  strategy.getState()[key] = value;
};

describe('InMemoryFsStrategy', () => {
  const cacheName = 'test';
  const cachePath = resolve(CACHE_DIR, `${cacheName}.cache`);

  let strategy: InMemoryFsStrategy;

  beforeEach(() => {
    strategy = new InMemoryFsStrategy(cacheName);
  });

  describe('initState', () => {
    test('if path not exists don`t init state', async () => {
      fsUtilsMocked.isExists.mockResolvedValueOnce(false);

      await strategy.initState();

      expect(fsUtilsMocked.isExists).toBeCalledWith(cachePath);
      expect(fspMocked.readFile).not.toBeCalledWith(cachePath);
      expect(v8Mocked.deserialize).not.toBeCalled();
    });

    test('if path exists read cache and set it', async () => {
      const readFileBuffer = Buffer.from('test');
      const state = { a: 'test' };

      fsUtilsMocked.isExists.mockResolvedValueOnce(true);
      fspMocked.readFile.mockResolvedValueOnce(readFileBuffer);
      v8Mocked.deserialize.mockReturnValueOnce(state);

      await strategy.initState();

      expect(fsUtilsMocked.isExists).toBeCalledWith(cachePath);
      expect(fspMocked.readFile).toBeCalledWith(cachePath);
      expect(v8Mocked.deserialize).toBeCalledWith(readFileBuffer);
      expect(strategy.getState()).toBe(state);
    });
  });

  describe('initStateIfNeed', () => {
    test('state can`t inits more than 1 time', async () => {
      strategy.initState = jest.fn();

      await strategy.initStateIfNeed();
      await strategy.initStateIfNeed();
      await strategy.initStateIfNeed();

      expect(strategy.initState).toBeCalledTimes(1);
    });
  });

  describe('throttledSaveState', () => {
    test('using throttle', async () => {
      strategy.saveState = jest.fn();

      strategy.throttledSaveState();
      strategy.throttledSaveState();
      strategy.throttledSaveState();

      await InMemoryFsStrategy.waitWriteTimeout();

      expect(strategy.saveState).toBeCalledTimes(1);
    });
  });

  describe('saveState', () => {
    test('save state to .cache file', async () => {
      const serializeResult = Buffer.from('test');

      v8Mocked.serialize.mockReturnValueOnce(serializeResult);

      await strategy.saveState();

      expect(v8Mocked.serialize).toBeCalledWith(strategy.getState());
      expect(fspMocked.mkdir).toBeCalledWith(CACHE_DIR, { recursive: true });
      expect(fspMocked.writeFile).toBeCalledWith(cachePath, serializeResult);
    });
  });

  describe('set', () => {
    const key = 'key';
    const value = 'value';

    beforeEach(() => {
      strategy.initStateIfNeed = jest.fn();
      strategy.throttledSaveState = jest.fn();
    });

    test('set value to state', async () => {
      await strategy.set(key, value);

      expect(await strategy.get(key)).toBe(value);
    });

    test('runs initStateIfNeed and throttledSaveState', async () => {
      await strategy.set(key, value);

      expect(strategy.initStateIfNeed).toBeCalledTimes(1);
      expect(strategy.throttledSaveState).toBeCalledTimes(1);
    });
  });

  describe('get', () => {
    const key = 'key';
    let set: ReturnType<typeof setFactory>;

    beforeEach(() => {
      strategy.initStateIfNeed = jest.fn();
      set = setFactory(strategy);
    });

    test('runs initStateIfNeed', async () => {
      await strategy.get(key);

      expect(strategy.initStateIfNeed).toBeCalledTimes(1);
    });

    test('if value not exists return undefined', async () => {
      expect(await strategy.get(key)).toBe(undefined);
    });

    test('if value exits return value', async () => {
      const value = 'value';
      set(key, value);

      expect(await strategy.get(key)).toBe(value);
    });
  });

  describe('has', () => {
    const key = 'key';
    let set: ReturnType<typeof setFactory>;

    beforeEach(() => {
      strategy.initStateIfNeed = jest.fn();
      set = setFactory(strategy);
    });

    test('runs initStateIfNeed', async () => {
      await strategy.has(key);

      expect(strategy.initStateIfNeed).toBeCalledTimes(1);
    });

    test('if key not exist return false', async () => {
      expect(await strategy.has(key)).toBe(false);
    });

    test('if key exist return true', async () => {
      const value = 'value';

      set(key, value);

      expect(await strategy.has(key)).toBe(true);
    });
  });
});
