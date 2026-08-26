'use client';

import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import {
	getAuthRepository,
	getLoginUseCase,
} from '../../infrastructure/auth.factory';
import { useAuthStore } from '../state/auth.store';
import type { LoginCredentials } from '../../domain/interfaces/auth-repository.interface';
import type { User } from '../../domain/entities/user';

interface UseAuthReturn {
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	login(credentials: LoginCredentials): Promise<void>;
	logout(): Promise<void>;
}

/**
 * Bridges auth UI with domain use cases.
 *
 * - Session identity (`user`, `accessToken`, `isAuthenticated`) comes from the
 *   Zustand store so any component can read it synchronously.
 * - The async login call is a TanStack Query mutation, which owns request
 *   lifecycle state (`isPending`, `error`) — no manual loading flags.
 */
export function useAuth(): UseAuthReturn {
	const user = useAuthStore((state) => state.user);
	const accessToken = useAuthStore((state) => state.accessToken);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const setSession = useAuthStore((state) => state.setSession);
	const clearSession = useAuthStore((state) => state.clearSession);

	const loginUseCase = getLoginUseCase();
	const authRepository = getAuthRepository();

	const loginMutation = useMutation({
		mutationFn: (credentials: LoginCredentials) =>
			loginUseCase.execute(credentials),
		onSuccess: (session) => setSession(session),
	});

	const login = useCallback(
		async (credentials: LoginCredentials): Promise<void> => {
			await loginMutation.mutateAsync(credentials);
		},
		[loginMutation],
	);

	const logout = useCallback(async (): Promise<void> => {
		try {
			await authRepository.logout();
		} finally {
			clearSession();
		}
	}, [authRepository, clearSession]);

	return {
		user,
		accessToken,
		isAuthenticated,
		isLoading: loginMutation.isPending,
		error:
			loginMutation.error instanceof Error
				? loginMutation.error.message
				: loginMutation.error
					? 'Login failed'
					: null,
		login,
		logout,
	};
}
