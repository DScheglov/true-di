import { User } from '../domain/users';

export interface IUserProvider {
  getCurrentUser(): Promise<User | null>
}

export interface IUserService extends IUserProvider {}
