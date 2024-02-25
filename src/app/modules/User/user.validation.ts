import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    pin: z.string().min(5).max(5),
    mobileNumber: z.number().min(11),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'USER', 'AGENT']),
    nid: z.number(),
  }),
});

export const UserValidationSchema = { createUserValidationSchema };
