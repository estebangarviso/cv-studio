import type { MetadataRoute } from 'next';

/**
 * PWA Web App Manifest — served at /manifest.webmanifest by Next.js.
 * Icons must be placed in public/icons/ (192x192 and 512x512 PNG).
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'CV Studio',
		short_name: 'cv-studio',
		description: 'CV builder with Google OAuth, Drive storage, and browser-native PDF export',
		start_url: '/app',
		display: 'standalone',
		orientation: 'portrait',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/icons/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore — "maskable" is valid per spec but Next.js types lag behind
				purpose: 'maskable',
			},
		],
	};
}
