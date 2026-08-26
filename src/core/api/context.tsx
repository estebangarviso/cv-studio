'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Middleware } from 'openapi-fetch';

import { createApiCoreClient, type ApiCoreClient } from './client';

export interface ApiProviderProps {
	children: ReactNode;
	baseUrl: string;
	authToken?: string;
}

interface ApiContextValue {
	client: ApiCoreClient;
}

const ApiContext = createContext<ApiContextValue | null>(null);

/**
 * Injects a configured API client into the React tree.
 *
 * Forks can extend this provider with additional headers (e.g. tenant ID,
 * correlation ID) by adding middleware in the useMemo block below.
 */
export function ApiProvider({
	children,
	baseUrl,
	authToken,
}: ApiProviderProps) {
	const client = useMemo<ApiCoreClient>(() => {
		const instance = createApiCoreClient(baseUrl);

		const authMiddleware: Middleware = {
			onRequest({ request }) {
				if (authToken) {
					request.headers.set('Authorization', `Bearer ${authToken}`);
				}
				return request;
			},
		};

		instance.use(authMiddleware);
		return instance;
	}, [baseUrl, authToken]);

	const value = useMemo<ApiContextValue>(() => ({ client }), [client]);

	return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/**
 * Reads the API client from the nearest ApiProvider.
 * @throws if called outside an ApiProvider tree.
 */
export function useApiClient(): ApiCoreClient {
	const context = useContext(ApiContext);
	if (context === null) {
		throw new Error('useApiClient must be used within an <ApiProvider>.');
	}
	return context.client;
}
