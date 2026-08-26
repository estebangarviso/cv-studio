import { getTranslations } from 'next-intl/server';

interface EditorPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;
  const t = await getTranslations('editor');

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1">
        <h1 className="mb-4 text-xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">CV ID: {id}</p>
        {/* TODO: CvForm component */}
      </div>
      <div className="w-[420px] border-l pl-6">
        {/* TODO: CvPreview component */}
        <p className="text-sm text-muted-foreground">{t('preview')}</p>
      </div>
    </div>
  );
}
