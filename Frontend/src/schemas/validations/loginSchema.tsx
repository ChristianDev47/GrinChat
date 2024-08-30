import { z } from 'zod';

export const loginSchema = z.object({
  // Validate email
  email: z.string({ required_error: 'El email es requerido.' }).email({
    message: 'Ingrese un email valido, ejm: user@gmail.com',
  }),

  // Validate password
  password: z.string({ required_error: 'La contraseña es requerida.' }),
});
