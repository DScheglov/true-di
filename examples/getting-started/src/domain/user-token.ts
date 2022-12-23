import { User } from './users';

export const parseToken = (token: string) => {
  try {
    return JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'),
    ) as User;
  } catch {
    return null;
  }
};
