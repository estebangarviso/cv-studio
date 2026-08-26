import { z } from 'zod';
import { UserSchema } from './user';

export const SessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
  user: UserSchema,
});

export type Session = z.infer<typeof SessionSchema>;
