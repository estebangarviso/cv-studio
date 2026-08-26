/**
 * Auth Module — Public API
 *
 * This is the ONLY file other modules should import from.
 * Everything else is internal implementation detail.
 *
 * Usage:
 *   import { useAuth, LoginForm, useAuthStore } from '@modules/auth';
 */

// ─── Domain Types (for type-level usage) ──────────
export type { User } from './domain/entities/user';
export type { Session } from './domain/entities/session';
export type {
  AuthRepository,
  LoginCredentials,
} from './domain/interfaces/auth-repository.interface';

// ─── Infrastructure / wiring (functional) ─────────
export {
  getAuthRepository,
  getLoginUseCase,
} from './infrastructure/auth.factory';
export { HttpAuthRepository } from './infrastructure/repositories/http-auth.repository';

// ─── Presentation (for UI consumption) ────────────
export { useAuth } from './presentation/hooks/use-auth';
export { LoginForm } from './presentation/components/login-form';

// ─── State (Zustand store) ────────────────────────
export { useAuthStore } from './presentation/state/auth.store';
