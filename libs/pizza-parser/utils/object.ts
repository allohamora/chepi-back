export const omit = <T, K extends keyof T>(target: T, keys: K[]) => {
  const copy = { ...target };

  for (const key of keys) {
    delete copy[key];
  }

  return copy as Omit<T, K>;
};

export const getNotDeepChanges = <O, T>(oldTarget: O, newTarget: T) => {
  const oldKeys = Object.keys(oldTarget);

  return oldKeys.reduce<{ key: string; old: unknown; new: unknown }[]>((state, key) => {
    const oldValue = oldTarget[key];
    const newValue = newTarget[key];

    if (oldValue !== newValue) {
      state.push({ key, old: oldValue, new: newValue });
    }

    return state;
  }, []);
};
