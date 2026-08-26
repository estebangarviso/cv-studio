import createClient, { type Middleware } from 'openapi-fetch';

export interface RuntimeRequestOptions {
	runtimeHeaders?: Record<string, string>;
}

function readRuntimeHeaders(options: unknown): Record<string, string> {
	if (
		typeof options === 'object' &&
		options !== null &&
		'runtimeHeaders' in options
	) {
		const candidate = (options as RuntimeRequestOptions).runtimeHeaders;
		if (candidate && typeof candidate === 'object') {
			return candidate;
		}
	}
	return {};
}

/**
 * Builds a type-safe transport client bound to a single API baseUrl.
 * Pass your generated OpenAPI paths type when connecting to an external backend.
 * @see docs/guides/002_connect-external-backend.md
 */
export function createApiCoreClient<Paths extends object = object>(
	baseUrl: string,
) {
	const client = createClient<Paths>({
		baseUrl,
		headers: { 'Content-Type': 'application/json' },
	});

	const transportMiddleware: Middleware = {
		onRequest({ request, options }) {
			const runtimeHeaders = readRuntimeHeaders(options);
			for (const [key, value] of Object.entries(runtimeHeaders)) {
				request.headers.set(key, value);
			}
			return request;
		},
		onResponse({ response }) {
			if (response.status === 401) {
				// Global logout / session-expiry handling placeholder
			}
			return response;
		},
	};

	client.use(transportMiddleware);
	return client;
}

export type ApiCoreClient<Paths extends object = object> = ReturnType<
	typeof createApiCoreClient<Paths>
>;
