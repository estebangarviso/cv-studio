export type { CvData, Skill, SideEntry, JobEntry, RefEntry } from './domain/entities/cv-data';
export { CvDataSchema, SkillSchema, SideEntrySchema, JobEntrySchema, RefEntrySchema } from './domain/entities/cv-data';
export type { TemplateConfig } from './domain/entities/template-config';
export { DEFAULT_TEMPLATE, TemplateConfigSchema } from './domain/entities/template-config';
export type { CvRepository } from './domain/interfaces/cv-repository.interface';
export { getSaveCvUseCase, getLoadCvUseCase, setCvRepository } from './infrastructure/cv.factory';
export { useCvEditorStore } from './presentation/state/cv-editor.store';
export { useCvList, useCv, useSaveCv } from './presentation/hooks/use-cv';
