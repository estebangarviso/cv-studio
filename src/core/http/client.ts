import { HttpClient } from './http-client';

let client: HttpClient | undefined;

/**
 * Lazily-created shared {@link HttpClient} singleton.
 *
 * Functional replacement for the former DI-registered `HTTP_CLIENT` token:
 * modules import this directly instead of resolving a container.
 */
export function getHttpClient(): HttpClient {
	if (!client) {
		client = new HttpClient({
			baseUrl:
				process.env.NEXT_PUBLIC_API_URL ??
				'http://localhost:3001/api/v1',
		});
	}
	return client;
}
