import type { Session } from '../entities/session';

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Port: Authentication repository contract.
 * Infrastructure layer provides the concrete adapter.
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<Session>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<Session>;
  getCurrentSession(): Promise<Session | null>;
}
