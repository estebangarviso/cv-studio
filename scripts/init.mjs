#!/usr/bin/env node
import { Console } from 'node:console';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
/**
 * Project initializer — replaces template placeholders.
 * Usage: node scripts/init.mjs
 */
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const logger = new Console({ stderr: output, stdout: output });

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

const SKIP_DIRS = new Set([
	'.git',
	'.next',
	'.pnpm-store',
	'.reports',
	'.turbo',
	'build',
	'coverage',
	'dist',
	'node_modules',
]);

const SKIP_FILES = new Set([
	'package-lock.json',
	'pnpm-lock.yaml',
	'yarn.lock',
]);

const BINARY_EXTENSIONS = new Set([
	'.eot',
	'.gif',
	'.gz',
	'.ico',
	'.jpeg',
	'.jpg',
	'.mp4',
	'.png',
	'.tar',
	'.ttf',
	'.webm',
	'.woff',
	'.woff2',
	'.zip',
]);

// ─── File walker ─────────────────────────────────────────────────────────────

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	/** @type {string[]} */
	const files = [];
	for (const entry of entries) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
		} else if (
			!SKIP_FILES.has(entry.name) &&
			!BINARY_EXTENSIONS.has(extname(entry.name))
		) {
			files.push(fullPath);
		}
	}
	return files;
}

// ─── Replace in a single file ─────────────────────────────────────────────────

async function replaceInFile(filePath, replacements) {
	let content = await readFile(filePath, 'utf8');
	let changed = false;
	for (const [from, to] of replacements) {
		const next = content.replaceAll(from, to);
		if (next !== content) {
			content = next;
			changed = true;
		}
	}
	if (changed) await writeFile(filePath, content, 'utf8');
	return changed;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(value, field, optional = false) {
	if (!optional && !value.trim()) throw new Error(`"${field}" is required.`);
}

function validateBasePath(value) {
	if (!value.startsWith('/'))
		throw new Error('"base-path" must start with "/" (e.g. /app).');
}

function validateBaseUrl(value) {
	try {
		new URL(value);
	} catch {
		throw new Error(
			'"base-url" must be a valid URL (e.g. https://myapp.com).',
		);
	}
}

function validateLocaleCode(value, field) {
	// bCP 47: 2-3 letter language codes (optionally with region, e.g. en-US)
	if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/u.test(value))
		throw new Error(
			`"${field}" must be a valid BCP 47 locale code (e.g. en, es, pt-BR).`,
		);
}

/**
 * Converts a comma-separated locale list (e.g. "en,es") to the format
 * expected inside a TypeScript `as const` array: `'en', 'es'`.
 * @param {string} value - Raw input (e.g. "en,es" or "en, es")
 * @returns {string}
 */
function formatSupportedLocales(value) {
	return value
		.split(',')
		.map((s) => `'${s.trim()}'`)
		.join(', ');
}

/**
 * Derives a camelCase JS variable name from a Google Fonts import name.
 * Examples: "Inter" → "inter", "Geist_Sans" → "geistSans", "Roboto_Mono" → "robotoMono"
 * @param {string} fontFamily
 * @returns {string}
 */
function fontFamilyToVar(fontFamily) {
	const parts = fontFamily.split('_');
	return parts
		.map((p, i) =>
			i === 0
				? p.charAt(0).toLowerCase() + p.slice(1)
				: p.charAt(0).toUpperCase() + p.slice(1),
		)
		.join('');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
	const rl = createInterface({ input, output });

	logger.info('\n🚀  Project Initializer\n');

	const projectName = (
		await rl.question(
			'  project-name      (e.g. my-project):                  ',
		)
	).trim();
	const appName = (
		await rl.question(
			'  app-name          (e.g. my-project-frontend):          ',
		)
	).trim();
	let appTitle = (
		await rl.question(
			'  app-title         (e.g. My Project, optional):         ',
		)
	).trim();
	let appDescription = (
		await rl.question(
			'  app-description   (e.g. Enterprise app, optional):     ',
		)
	).trim();
	const appBackendTitle = (
		await rl.question(
			'  app-backend-title (e.g. My Project Backend):           ',
		)
	).trim();
	const basePath = (
		await rl.question(
			'  base-path         (e.g. /app):                         ',
		)
	).trim();
	const baseUrl = (
		await rl.question(
			'  base-url          (e.g. https://myapp.com):            ',
		)
	).trim();
	const fontFamily =
		(
			await rl.question(
				'  font-family       (e.g. Inter, Geist_Sans, optional):  ',
			)
		).trim() || 'Inter';
	const fontWeights =
		(
			await rl.question(
				"  font-weights      (e.g. '400', '600', '700'):          ",
			)
		).trim() || "'400', '600', '700'";
	const defaultLocale =
		(
			await rl.question(
				'  default-locale    (e.g. en, optional):                 ',
			)
		).trim() || 'en';
	const supportedLocalesRaw =
		(
			await rl.question(
				'  supported-locales (comma-separated, e.g. en,es):       ',
			)
		).trim() || defaultLocale;
	const defaultBranch =
		(
			await rl.question(
				'  default-branch    (e.g. main, develop, optional):     ',
			)
		).trim() || 'main';
	rl.close();

	try {
		validate(projectName, 'project-name');
		validate(appName, 'app-name');
		validate(appTitle, 'app-title', true);
		validate(appDescription, 'app-description', true);
		validate(appBackendTitle, 'app-backend-title');
		validate(basePath, 'base-path');
		validateBasePath(basePath);
		validate(baseUrl, 'base-url');
		validateBaseUrl(baseUrl);
		validateLocaleCode(defaultLocale, 'default-locale');
	} catch (error) {
		logger.error(`\n❌  ${error.message}`);
		process.exit(1);
	}

	// derive defaults for optional fields
	if (!appTitle)
		appTitle = appName
			.split(/[-_]/)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');

	if (!appDescription)
		appDescription = `${appTitle} — Enterprise Application`;

	// derive the JS variable name from the font family name
	const fontFamilyVar = fontFamilyToVar(fontFamily);

	// format supported locales for the TypeScript `as const` array
	const supportedLocales = formatSupportedLocales(supportedLocalesRaw);

	/** @type {[string, string][]} */
	const replacements = [
		['cv-studio', projectName],
		['cv-studio', appName],
		['CV Studio', appTitle],
		['CV builder with Google OAuth, Drive storage, and browser-native PDF export', appDescription],
		['CV Studio API', appBackendTitle],
		['/app', basePath],
		['http://localhost:3000', baseUrl],
		['Inter', fontFamily],
		['inter', fontFamilyVar],
		[''400', '500', '600', '700'', fontWeights],
		['es', defaultLocale],
		[''es', 'en'', supportedLocales],
		['main', defaultBranch],
	];

	logger.info('\n📝  Replacing placeholders in files...\n');

	const files = await walk(ROOT);
	let count = 0;

	for (const file of files) {
		const changed = await replaceInFile(file, replacements);
		if (changed) {
			logger.info(`  ✓  ${relative(ROOT, file)}`);
			count++;
		}
	}

	if (count === 0) {
		logger.info(
			'  ⚠️  No placeholders found — project may already be initialized.',
		);
	} else {
		logger.info(
			`\n✅  Done! ${count} file${count === 1 ? '' : 's'} updated.\n`,
		);
		logger.info('Next steps:');
		logger.info('  pnpm install');
		logger.info('  pnpm dev\n');
	}
}

{
	try {
		await main();
	} catch (error) {
		logger.error('\n❌', error.message ?? error);
		process.exit(1);
	}
}
