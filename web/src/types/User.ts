import { z } from 'zod';

export const User = z.object({
  id: z.string(),
  phone_number: z.string(),
  password_hash: z.string(),
  email: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  created_at: z.coerce.string().nullable().optional(),
  updated_at: z.coerce.string().nullable().optional(),
  display_name: z.string().nullable().optional(),
  nickname: z.string().nullable().optional(),
});


export type UserT = z.infer<typeof User>;
