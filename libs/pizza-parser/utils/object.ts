export const omit = <T, K extends keyof T>(target: T, keys: K[]) => {
  const copy = { ...target };

  for (const key of keys) {
    delete copy[key];
  }

  return copy as Omit<T, K>;
};

const isObject = <V>(value: V) => typeof value === 'object' && value !== null;
const isFunction = <V>(value: V) => typeof value === 'function';
const isPrimitive = <V>(value: V) => !isObject(value) && !isFunction(value);

const isObjects = <A, B>(a: A, b: B) => isObject(a) && isObject(b);

const isDifferentTypes = <A, B>(a: A, b: B) => typeof a !== typeof b && a !== b;

const isFunctionsNotEqual = <A, B>(a: A, b: B) => isFunction(a) && isFunction(b) && a.toString() !== b.toString();
const isPrimitiveNotEqual = <A, B>(a: A, b: B) => (isPrimitive(a) || isPrimitive(b)) && a !== b;

type DeepEqual = <A, B>(a: A, b: B) => boolean;

interface ObjectsEqualOptions {
  deepEqual: DeepEqual;
}

const objectsEqual = <A, B>(a: A, b: B, { deepEqual }: ObjectsEqualOptions) => {
  const keysSet = new Set([...Object.keys(a), ...Object.keys(b)]);
  const keys = Array.from(keysSet);

  for (const key of keys) {
    const values: [unknown, unknown] = [a[key], b[key]];

    if (isPrimitiveNotEqual(...values)) {
      return false;
    }

    if (isFunctionsNotEqual(...values)) {
      return false;
    }

    if (isObjects(...values) && !deepEqual(...values)) {
      return false;
    }
  }

  return true;
};

const deepEqual: DeepEqual = (a, b) => {
  if (a === b) {
    return true;
  }

  if (isDifferentTypes(a, b)) {
    return false;
  }

  if (isFunctionsNotEqual(a, b)) {
    return false;
  }

  if (isPrimitiveNotEqual(a, b)) {
    return false;
  }

  return objectsEqual(a, b, { deepEqual });
};

export const objectDiff = <A, B>(a: A, b: B) => {
  const keysSet = new Set([...Object.keys(a), ...Object.keys(b)]);
  const keys = Array.from(keysSet);

  return keys.reduce<{ key: string; values: [unknown, unknown] }[]>((result, key) => {
    const values: [unknown, unknown] = [a[key], b[key]];

    if (!deepEqual(...values)) {
      result.push({ key, values });
    }

    return result;
  }, []);
};
