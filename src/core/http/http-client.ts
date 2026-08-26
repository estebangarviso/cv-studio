import { z } from 'zod';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpClientConfig {
	baseUrl: string;
	headers?: Record<string, string>;
}

export class HttpClient {
	constructor(private config: HttpClientConfig) {}

	private async request<T>(
		method: HttpMethod,
		path: string,
		options?: {
			body?: unknown;
			schema?: z.ZodType<T>;
			headers?: Record<string, string>;
		},
	): Promise<T> {
		const url = `${this.config.baseUrl}${path}`;

		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				...this.config.headers,
				...options?.headers,
			},
			body: options?.body ? JSON.stringify(options.body) : undefined,
		});

		if (!response.ok) {
			throw new HttpError(response.status, response.statusText, url);
		}

		const data = await response.json();

		if (options?.schema) {
			return options.schema.parse(data);
		}

		return data as T;
	}

	get<T>(path: string, schema?: z.ZodType<T>): Promise<T> {
		return this.request<T>('GET', path, { schema });
	}

	post<T>(path: string, body: unknown, schema?: z.ZodType<T>): Promise<T> {
		return this.request<T>('POST', path, { body, schema });
	}

	put<T>(path: string, body: unknown, schema?: z.ZodType<T>): Promise<T> {
		return this.request<T>('PUT', path, { body, schema });
	}

	patch<T>(path: string, body: unknown, schema?: z.ZodType<T>): Promise<T> {
		return this.request<T>('PATCH', path, { body, schema });
	}

	delete<T>(path: string, schema?: z.ZodType<T>): Promise<T> {
		return this.request<T>('DELETE', path, { schema });
	}
}

export class HttpError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		public url: string,
	) {
		super(`HTTP ${status} ${statusText} — ${url}`);
		this.name = 'HttpError';
	}
}
