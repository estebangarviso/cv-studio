'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

import { QueryProvider } from '@core/query/query-provider';

interface ProvidersProps {
	children: ReactNode;
}

/**
 * Composes all application-level client providers in a single tree.
 *
 * QueryProvider owns server-state caching; ThemeProvider is innermost since it
 * only touches the DOM `class` attribute.
 */
export function Providers({ children }: ProvidersProps) {
	return (
		<QueryProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</QueryProvider>
	);
}
