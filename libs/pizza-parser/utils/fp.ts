type Middleware<V, RV = V> = (value: V) => RV;

export const combine = <V>(...middlewares: Middleware<V, unknown>[]) => {
  return (value: V) => {
    for (const middleware of middlewares) {
      middleware(value);
    }
  };
};

export const compose = <V>(...midlewares: Middleware<V>[]) => {
  return (value: V) => {
    return midlewares.reduce((state, middleware) => middleware(state), value);
  };
};
