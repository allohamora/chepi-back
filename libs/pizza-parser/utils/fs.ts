import { access } from 'fs/promises';

export const pathExists = async (path: string) => {
  return await access(path)
    .then(() => true)
    .catch(() => false);
};
