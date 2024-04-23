import { User } from '../domain/users';

export interface IUserProvider {
  getCurrentUser(): Promise<User | null>
}

export interface ITokenInitializer {
  setToken(token: string | null): Promise<void>;
}

export interface IUserService extends IUserProvider, ITokenInitializer {}
