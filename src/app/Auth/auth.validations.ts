import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    mobileNumber: z.number().min(10).optional(),
    pin: z.string().min(5).max(5),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
};
