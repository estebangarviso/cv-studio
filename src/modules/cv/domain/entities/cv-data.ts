import { z } from 'zod';

export const SkillSchema = z.object({
  label: z.string().min(1),
  level: z.number().min(0).max(100),
  subtitle: z.string().optional(),
});

export const SideEntrySchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
});

export const JobEntrySchema = z.object({
  role: z.string().min(1),
  details: z.string(),
  bullets: z.array(z.string()),
});

export const RefEntrySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
});

export const CvDataSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  title: z.string(),
  phone: z.string(),
  email: z.string().email(),
  city: z.string(),
  aboutMe: z.string(),
  education: z.array(SideEntrySchema),
  courses: z.array(SideEntrySchema),
  extracurricular: z.array(SideEntrySchema),
  experience: z.array(JobEntrySchema),
  skills: z.array(SkillSchema),
  languages: z.array(SkillSchema),
  references: z.array(RefEntrySchema),
  linkedinUrl: z.string().url().optional(),
  drivingLicense: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type CvData = z.infer<typeof CvDataSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SideEntry = z.infer<typeof SideEntrySchema>;
export type JobEntry = z.infer<typeof JobEntrySchema>;
export type RefEntry = z.infer<typeof RefEntrySchema>;
