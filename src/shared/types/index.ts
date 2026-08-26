/**
 * Shared type definitions used across modules.
 */

/** Standard paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Standard API error response */
export interface ApiError {
  status: number;
  title: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

/** UUID brand type */
export type UUID = string & { readonly __brand: 'UUID' };
