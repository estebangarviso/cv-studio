/**
 * Shared utility functions.
 */

export { cn } from './cn';

/** Type-safe exhaustive check for switch/if statements */
export function assertNever(value: never): never {
	throw new Error(`Unexpected value: ${value}`);
}

/** Delay execution (useful for testing loading states) */
export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Format a UUID to a short display string */
export function shortId(uuid: string): string {
	return uuid.slice(0, 8);
}
