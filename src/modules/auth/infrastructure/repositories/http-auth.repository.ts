import type { HttpClient } from '@core/http';
import { SessionSchema, type Session } from '../../domain/entities/session';
import type {
  AuthRepository,
  LoginCredentials,
} from '../../domain/interfaces/auth-repository.interface';

/**
 * Adapter: HTTP-based auth repository.
 * Implements the AuthRepository port using the shared HttpClient.
 */
export class HttpAuthRepository implements AuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login(credentials: LoginCredentials): Promise<Session> {
    return this.http.post('/auth/login', credentials, SessionSchema);
  }

  async logout(): Promise<void> {
    await this.http.post('/auth/logout', {});
  }

  async refreshToken(refreshToken: string): Promise<Session> {
    return this.http.post('/auth/refresh', { refreshToken }, SessionSchema);
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      return await this.http.get('/auth/session', SessionSchema);
    } catch {
      return null;
    }
  }
}
