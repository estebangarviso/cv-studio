'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';
import { Label } from '@shared/ui/primitives/label';
import { Textarea } from '@shared/ui/primitives/textarea';
import { ScrollArea } from '@shared/ui/primitives/scroll-area';

import { type CvData, CvDataSchema } from '../../domain/entities/cv-data';

interface CvFormProps {
  defaultValues?: Partial<CvData>;
  onSubmit: (data: CvData) => void;
  onChange?: (data: CvData) => void;
}

const EMPTY_CV: CvData = {
  name: '',
  title: '',
  phone: '',
  email: '',
  city: '',
  aboutMe: '',
  education: [],
  courses: [],
  extracurricular: [],
  experience: [],
  skills: [],
  languages: [],
  references: [],
};

export function CvForm({ defaultValues, onSubmit, onChange }: CvFormProps) {
  const t = useTranslations('cvForm');

  const form = useForm<CvData>({
    resolver: zodResolver(CvDataSchema),
    defaultValues: { ...EMPTY_CV, ...defaultValues },
    mode: 'onChange',
  });

  const { register, handleSubmit, watch, formState: { errors } } = form;

  const experience = useFieldArray({ control: form.control, name: 'experience' });
  const education = useFieldArray({ control: form.control, name: 'education' });
  const courses = useFieldArray({ control: form.control, name: 'courses' });
  const skills = useFieldArray({ control: form.control, name: 'skills' });
  const languages = useFieldArray({ control: form.control, name: 'languages' });
  const references = useFieldArray({ control: form.control, name: 'references' });
  const extracurricular = useFieldArray({ control: form.control, name: 'extracurricular' });

  // Live preview updates
  const watchedData = watch();
  if (onChange) {
    // Using watch callback would be better but this works for MVP
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pr-4">
        {/* Personal Info */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase text-muted-foreground">{t('personal')}</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">{t('name')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="title">{t('title')}</Label>
              <Input id="title" {...register('title')} />
            </div>
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div>
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input id="phone" {...register('phone')} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="city">{t('city')}</Label>
              <Input id="city" {...register('city')} />
            </div>
          </div>
        </fieldset>

        {/* About Me */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold uppercase text-muted-foreground">{t('aboutMe')}</legend>
          <Textarea {...register('aboutMe')} rows={3} />
        </fieldset>

        {/* Experience */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold uppercase text-muted-foreground">{t('experience')}</legend>
            <Button type="button" variant="outline" size="sm" onClick={() => experience.append({ role: '', details: '', bullets: [''] })}>
              + {t('add')}
            </Button>
          </div>
          {experience.fields.map((field, i) => (
            <div key={field.id} className="space-y-2 rounded border p-3">
              <div className="flex justify-between">
                <Input placeholder={t('role')} {...register(`experience.${i}.role`)} />
                <Button type="button" variant="ghost" size="sm" onClick={() => experience.remove(i)}>✕</Button>
              </div>
              <Input placeholder={t('details')} {...register(`experience.${i}.details`)} />
              <Textarea placeholder={t('bullets')} {...register(`experience.${i}.bullets.0`)} rows={2} />
            </div>
          ))}
        </fieldset>

        {/* Education */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold uppercase text-muted-foreground">{t('education')}</legend>
            <Button type="button" variant="outline" size="sm" onClick={() => education.append({ title: '', subtitle: '' })}>
              + {t('add')}
            </Button>
          </div>
          {education.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <Input placeholder={t('entryTitle')} {...register(`education.${i}.title`)} />
              <Input placeholder={t('entrySubtitle')} {...register(`education.${i}.subtitle`)} />
              <Button type="button" variant="ghost" size="sm" onClick={() => education.remove(i)}>✕</Button>
            </div>
          ))}
        </fieldset>

        {/* Skills */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold uppercase text-muted-foreground">{t('skills')}</legend>
            <Button type="button" variant="outline" size="sm" onClick={() => skills.append({ label: '', level: 50 })}>
              + {t('add')}
            </Button>
          </div>
          {skills.fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input placeholder={t('skillLabel')} {...register(`skills.${i}.label`)} className="flex-1" />
              <Input type="number" min={0} max={100} {...register(`skills.${i}.level`, { valueAsNumber: true })} className="w-20" />
              <Button type="button" variant="ghost" size="sm" onClick={() => skills.remove(i)}>✕</Button>
            </div>
          ))}
        </fieldset>

        {/* References */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold uppercase text-muted-foreground">{t('references')}</legend>
            <Button type="button" variant="outline" size="sm" onClick={() => references.append({ name: '', email: '', phone: '' })}>
              + {t('add')}
            </Button>
          </div>
          {references.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-3 gap-2">
              <Input placeholder={t('refName')} {...register(`references.${i}.name`)} />
              <Input placeholder={t('refEmail')} {...register(`references.${i}.email`)} />
              <div className="flex gap-1">
                <Input placeholder={t('refPhone')} {...register(`references.${i}.phone`)} />
                <Button type="button" variant="ghost" size="sm" onClick={() => references.remove(i)}>✕</Button>
              </div>
            </div>
          ))}
        </fieldset>

        {/* LinkedIn + Driving License */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase text-muted-foreground">{t('other')}</legend>
          <div>
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input id="linkedinUrl" {...register('linkedinUrl')} />
          </div>
          <div>
            <Label htmlFor="drivingLicense">{t('drivingLicense')}</Label>
            <Input id="drivingLicense" {...register('drivingLicense')} />
          </div>
        </fieldset>

        <Button type="submit" className="w-full print:hidden">{t('save')}</Button>
      </form>
    </ScrollArea>
  );
}
