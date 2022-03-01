export interface Constructable<T> {
  new (...args: any): T;
}

export type TypeUnionToTypes<T> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'null'
  ? null
  : T extends 'undefined'
  ? undefined
  : never;
