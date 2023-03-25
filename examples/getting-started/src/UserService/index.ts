import { parseToken } from '../domain/user-token';
import { User } from '../domain/users';
import { IUserService } from '../interfaces';

export class UserService implements IUserService {
  #user: User | null = null;

  #token: string | null = null;

  constructor(readonly token: string | null) {
    this.#token = token;
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.#user == null && this.#token != null) {
      this.#user = parseToken(this.#token);
    }

    return this.#user;
  }
}
