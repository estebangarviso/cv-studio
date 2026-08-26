// Domain
export type { Locale } from './domain/entities/locale.ts';
export {
  DEFAULT_LOCALE,
  isLocale,
  SUPPORTED_LOCALES,
} from './domain/entities/locale.ts';

// Server (use only in Server Components / Route Handlers)
export { getLocale, getTranslations } from './server.ts';
