export const capitalize = (string: string) => `${string[0].toUpperCase()}${string.slice(1)}`;
export const lower = (string: string) => string.toLowerCase();
export const lowerAndCapitalize = (string: string) => capitalize(lower(string));
