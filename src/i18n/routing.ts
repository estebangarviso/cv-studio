import { defineRouting } from 'next-intl/routing';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@modules/i18n';

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeCookie: { name: 'NEXT_LOCALE' },
});
