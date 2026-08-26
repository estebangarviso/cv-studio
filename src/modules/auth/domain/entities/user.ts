import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'operator', 'viewer']),
  tenantId: z.string().uuid(),
});

export type User = z.infer<typeof UserSchema>;
