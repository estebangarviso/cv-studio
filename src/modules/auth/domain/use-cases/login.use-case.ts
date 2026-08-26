import type { AuthRepository, LoginCredentials } from '../interfaces/auth-repository.interface';
import type { Session } from '../entities/session';

/**
 * Login Use Case — pure business logic, no framework dependency.
 */
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<Session> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    return this.authRepository.login(credentials);
  }
}
