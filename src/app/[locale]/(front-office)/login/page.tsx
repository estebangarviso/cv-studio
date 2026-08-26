import { useTranslations } from 'next-intl';

import { SignInButton } from './sign-in-button';

export default function LoginPage() {
  const t = useTranslations('login');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-sm text-center text-muted-foreground">
        {t('description')}
      </p>
      <SignInButton />
    </div>
  );
}
