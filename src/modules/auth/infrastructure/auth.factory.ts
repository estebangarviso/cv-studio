import { getHttpClient } from '@core/http';

import { LoginUseCase } from '../domain/use-cases/login.use-case';
import type { AuthRepository } from '../domain/interfaces/auth-repository.interface';
import { HttpAuthRepository } from './repositories/http-auth.repository';

/**
 * Functional wiring for the auth module.
 *
 * Replaces the former DI container/token registration: dependencies are
 * constructed once (lazy singletons) and shared via plain module imports.
 */

let authRepository: AuthRepository | undefined;
let loginUseCase: LoginUseCase | undefined;

export function getAuthRepository(): AuthRepository {
	if (!authRepository) {
		authRepository = new HttpAuthRepository(getHttpClient());
	}
	return authRepository;
}

export function getLoginUseCase(): LoginUseCase {
	if (!loginUseCase) {
		loginUseCase = new LoginUseCase(getAuthRepository());
	}
	return loginUseCase;
}
