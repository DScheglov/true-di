import { parseToken } from '../domain/user-token';
import { User } from '../domain/users';
import { IUserService } from '../interfaces';

export class UserService implements IUserService {
  #user: User | null = null;

  constructor() {
    console.log('Creating a User Service');
  }

  async setToken(token: string | null) {
    this.#user = token !== null ? parseToken(token) : null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.#user;
  }
}
