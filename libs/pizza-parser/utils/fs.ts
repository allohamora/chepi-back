import { access } from 'fs/promises';

export const isExists = async (path: string) => {
  return await access(path)
    .then(() => true)
    .catch(() => false);
};
