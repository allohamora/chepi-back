export const omit = <T, K extends keyof T>(target: T, keys: K[]) => {
  const copy = { ...target };

  for (const key of keys) {
    delete copy[key];
  }

  return copy as Omit<T, K>;
};

export const pick = <T, K extends keyof T>(target: T, keys: readonly K[]) => {
  return keys.reduce<Pick<T, K>>((result, key) => {
    result[key] = target[key];

    return result;
  }, {} as Pick<T, K>);
};

const isObject = <V>(value: V) => typeof value === 'object' && value !== null;
const isFunction = <V>(value: V) => typeof value === 'function';
const isPrimitive = <V>(value: V) => !isObject(value) && !isFunction(value);

const isObjects = <A, B>(a: A, b: B) => isObject(a) && isObject(b);

const isDifferentTypes = <A, B>(a: A, b: B) => typeof a !== typeof b && (a as unknown) !== b;

const isFunctionsNotEqual = <A, B>(a: A, b: B) => isFunction(a) && isFunction(b) && a.toString() !== b.toString();
const isPrimitiveNotEqual = <A, B>(a: A, b: B) => (isPrimitive(a) || isPrimitive(b)) && (a as unknown) !== b;

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
  if ((a as unknown) === b) {
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

export const objectDiff = <A, B, Key = keyof A | keyof B>(a: A, b: B) => {
  const keysSet = new Set([...Object.keys(a), ...Object.keys(b)]);
  const keys = Array.from(keysSet) as unknown[] as Key[];

  return keys.reduce<{ key: Key; values: [A[keyof A], B[keyof B]] }[]>((result, key) => {
    const values: [A[keyof A] | undefined, B[keyof B] | undefined] = [
      a[key as unknown as keyof A],
      b[key as unknown as keyof B],
    ];

    if (!deepEqual(...values)) {
      result.push({ key, values });
    }

    return result;
  }, []);
};
