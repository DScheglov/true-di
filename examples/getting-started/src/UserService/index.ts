import { parseToken } from '../domain/user-token';
import { User } from '../domain/users';
import { IUserService } from '../interfaces/IUserService';

export class UserService implements IUserService {
  constructor(
    private readonly token: string | null,
  ) {}

  async getCurrentUser(): Promise<User | null> {
    const { token } = this;
    return token != null ? parseToken(token) : null;
  }
}
