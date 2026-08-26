import { create } from 'zustand';

import type { Session } from '../../domain/entities/session';
import type { User } from '../../domain/entities/user';

/**
 * Client-side auth state.
 *
 * Holds only the *session identity* that the UI needs synchronously (who is
 * logged in, and the token used to authorize requests). Async login/logout
 * flows live in `useAuth` via TanStack Query — this store is the source of
 * truth for the resolved session, not for request lifecycle state.
 */
interface AuthState {
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	setSession: (session: Session) => void;
	clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	isAuthenticated: false,
	setSession: (session) =>
		set({
			user: session.user,
			accessToken: session.accessToken,
			isAuthenticated: true,
		}),
	clearSession: () =>
		set({
			user: null,
			accessToken: null,
			isAuthenticated: false,
		}),
}));
