type Middleware<V> = (value: V) => V;

export const compose =
  <V>(...midlewares: Middleware<V>[]) =>
  (value: V) => {
    return midlewares.reduce((state, middleware) => middleware(state), value);
  };
