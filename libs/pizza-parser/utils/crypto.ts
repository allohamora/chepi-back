import crypto from 'crypto';

export const toSha256 = (str: string) => crypto.createHash('sha256').update(str).digest('hex');
