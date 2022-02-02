const SPACE = ' ';

export const expectTypeof = <V>(value: V, type: 'object' | 'string' | 'number') => expect(typeof value).toBe(type);
export const expectString = <V>(value: V) => expectTypeof(value, 'string');
export const expectObject = <V>(value: V) => expectTypeof(value, 'object');
export const expectNumber = <V>(value: V) => {
  expectTypeof(value, 'number');
  expect(value).not.toBeNaN();
};

const expectSomeTrue = (cheks: boolean[]) => {
  const isSomeTrue = cheks.some((check) => check === true);

  expect(isSomeTrue).toBeTruthy();
};

const expectAllTrue = (checks: boolean[]) => {
  for (const check of checks) {
    expect(check).toBeTruthy();
  }
};

const isNumberCheck = (value: number) => {
  const isNotNaN = !isNaN(value);
  const isTypeofNumber = typeof value === 'number';
  const isNumber = isNotNaN && isTypeofNumber;

  return isNumber;
};

export const expectNumberOrNull = <V extends number>(value: V) => {
  const isNumber = isNumberCheck(value);
  const isNull = value === null;
  const checks = [isNumber, isNull];

  expectSomeTrue(checks);
};

export const expectTrimmedString = <V extends string>(value: V) => {
  const isString = typeof value === 'string';
  const isNotStartsWithSpace = value[0] !== SPACE;
  const isNotEndsWithSpace = value.at(-1) !== SPACE;
  const checks = [isString, isNotStartsWithSpace, isNotEndsWithSpace];

  expectAllTrue(checks);
};
