import { z } from 'zod';

export const DriveFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  modifiedTime: z.string().datetime(),
  size: z.string().optional(),
});

export type DriveFile = z.infer<typeof DriveFileSchema>;
