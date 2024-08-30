import { z } from 'zod';

export const groupSchema = z.object({
  // Validate image
  image: z.instanceof(File).nullable().optional(),

  // Validate name
  name: z
    .string({ required_error: 'El nombre es requerido.' })
    .min(1, 'Escribe un nombre para tu grupo.'),
});

export const adjustProfileSchema = z.object({
  // Validate name
  name: z.string().min(1, 'El nombre es requerido.'),

  // Validate surname
  surname: z.string().min(1, 'El apellido es requerido.'),

  // Validate status
  status: z.string().min(1, 'Escribe un estado.'),
});
