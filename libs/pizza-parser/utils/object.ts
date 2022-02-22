export const omit = <T, K extends keyof T>(target: T, keys: K[]) => {
  const copy = { ...target };

  for (const key of keys) {
    delete copy[key];
  }

  return copy as Omit<T, K>;
};

const isObject = <T>(target: T) => {
  return typeof target === 'object' && target !== null;
};

export const getDiff = <O, T>(oldTarget: O, newTarget: T) => {
  const oldKeys = Object.keys(oldTarget);
  const newKeys = Object.keys(newTarget);

  const keys = [...new Set([...oldKeys, ...newKeys])];

  return keys.reduce<{ key: string; old: unknown; new: unknown }[]>((state, key) => {
    const oldValue = oldTarget[key];
    const newValue = newTarget[key];

    const isObjectEqual = isObject(oldValue) && isObject(newValue);

    if (oldValue !== newValue && !isObjectEqual) {
      state.push({ key, old: oldValue, new: newValue });
    }

    if (oldValue !== newValue && isObjectEqual) {
      const deepChanges = getDiff(oldValue, newValue).map((change) => {
        change.key = `${key}.${change.key}`;

        return change;
      });

      state.push(...deepChanges);
    }

    return state;
  }, []);
};
