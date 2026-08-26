import { z } from 'zod';

export const TemplateConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  colors: z.object({
    sidebarBg: z.string(),
    accent: z.string(),
    muted: z.string(),
  }),
  sidebarWidth: z.number().default(29),
});

export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;

export const DEFAULT_TEMPLATE: TemplateConfig = {
  id: 'meli-v1',
  name: 'Profesional Teal',
  colors: { sidebarBg: '#D4EDEC', accent: '#1A1A2E', muted: '#555555' },
  sidebarWidth: 29,
};
